const Debtor = require('../models/Debtor');
const Notification = require('../models/Notification');
const WelcomeUser = require('../models/WelcomeUser');
const Transaction = require('../models/Transaction');

// Get all debtors for a merchant
const getDebtors = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Merchant email is required' });
    }

    const debtors = await Debtor.find({ 
      merchantEmail: new RegExp(`^${email}$`, 'i') 
    }).sort({ updatedAt: -1 });
    res.status(200).json(debtors);
  } catch (error) {
    console.error('Error fetching debtors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single debtor by ID
const getDebtorById = async (req, res) => {
  try {
    const { id } = req.params;
    const debtor = await Debtor.findById(id);
    if (!debtor) {
      return res.status(404).json({ message: 'Debtor not found' });
    }
    // Sort transactions by date descending (newest first)
    debtor.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (debtor.reminders && debtor.reminders.length > 0) {
      debtor.reminders.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    }
    res.status(200).json(debtor);
  } catch (error) {
    console.error('Error fetching debtor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new debtor or add a credit transaction to an existing one
const addCreditTransaction = async (req, res) => {
  try {
    const { email, customerName, phoneNumber, amount, description, dueDate } = req.body;
    
    if (!email || !customerName || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let debtor = await Debtor.findOne({ 
      merchantEmail: new RegExp(`^${email}$`, 'i'), 
      customerName: { $regex: new RegExp(`^${customerName}$`, 'i') } 
    });

    const transaction = {
      type: 'CREDIT_SALE',
      amount,
      description,
      date: new Date()
    };

    if (debtor) {
      debtor.originalAmount = (debtor.originalAmount || debtor.totalOwed) + Number(amount);
      debtor.totalOwed += Number(amount);
      debtor.transactions.push(transaction);
      debtor.status = 'ACTIVE';
      if (dueDate) debtor.dueDate = new Date(dueDate);
      if (phoneNumber && !debtor.phoneNumber) debtor.phoneNumber = phoneNumber;
      await debtor.save();
    } else {
      debtor = new Debtor({
        merchantEmail: email,
        customerName,
        phoneNumber,
        originalAmount: Number(amount),
        totalOwed: Number(amount),
        status: 'ACTIVE',
        dueDate: dueDate ? new Date(dueDate) : null,
        transactions: [transaction]
      });
      await debtor.save();
    }

    // Create an Expense transaction in Transaction collection to track money out for the merchant
    try {
      const merchantUser = await WelcomeUser.findOne({ email: new RegExp(`^${email}$`, 'i') });
      if (merchantUser) {
        await Transaction.create({
          user: merchantUser._id,
          type: 'Expense',
          amount: Number(amount),
          category: 'Credit Given',
          description: description || `${customerName} - Credit Given`,
          source: `${customerName} Credit`,
          relatedCreditId: debtor._id,
          date: new Date()
        });
      }
    } catch (txErr) {
      console.error('Failed to create credit outflow transaction:', txErr);
    }

    res.status(201).json(debtor);
  } catch (error) {
    console.error('Error adding credit transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Resolve credit debt (supports partial or full settlement) and record income transaction
const resolveCredit = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, amount, description } = req.body;

    if (amount === undefined || amount === null || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'A valid payment amount is required' });
    }

    const debtor = await Debtor.findById(id);
    if (!debtor) {
      return res.status(404).json({ message: 'Debtor not found' });
    }

    // Verify merchant authorization if email provided
    if (email && debtor.merchantEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ message: 'Not authorized to resolve this credit' });
    }

    // Check if already fully resolved
    if ((debtor.status === 'RESOLVED' || debtor.status === 'PAID_OFF') && debtor.totalOwed <= 0) {
      return res.status(400).json({ message: 'Credit record is already fully resolved' });
    }

    const paymentAmount = Math.min(Number(amount), debtor.totalOwed > 0 ? debtor.totalOwed : Number(amount));

    // Update balance and resolved amounts
    debtor.totalOwed = Math.max(0, debtor.totalOwed - paymentAmount);
    debtor.resolvedAmount = (debtor.resolvedAmount || 0) + paymentAmount;

    // Update status based on remaining balance
    if (debtor.totalOwed === 0) {
      debtor.status = 'RESOLVED';
      debtor.resolvedAt = new Date();
    } else {
      debtor.status = 'PARTIALLY_PAID';
    }

    // Record repayment in debtor transactions history
    const repaymentTx = {
      type: 'REPAYMENT',
      amount: paymentAmount,
      description: description || 'Credit Repayment',
      date: new Date()
    };
    debtor.transactions.push(repaymentTx);

    await debtor.save();

    // Find merchant user to create incoming financial transaction
    const merchantEmail = (email || debtor.merchantEmail).toLowerCase();
    const merchantUser = await WelcomeUser.findOne({ email: merchantEmail });

    let incomeTx = null;
    if (merchantUser) {
      // 1. Create Income transaction in Transaction collection
      incomeTx = await Transaction.create({
        user: merchantUser._id,
        type: 'Income',
        amount: paymentAmount,
        category: 'Credit Repayment',
        description: description || `${debtor.customerName} Credit Payment`,
        source: `${debtor.customerName} Credit Payment`,
        relatedCreditId: debtor._id,
        isCreditRecovery: true,
        date: new Date()
      });

      // 2. Create in-app notification for the merchant
      try {
        await Notification.create({
          user: merchantUser._id,
          type: 'general',
          title: debtor.status === 'RESOLVED' ? 'Credit Debt Resolved' : 'Credit Payment Received',
          message: `${debtor.customerName} paid ₦${paymentAmount.toLocaleString()} towards credit.${debtor.status === 'RESOLVED' ? ' Account is fully settled.' : ` Remaining balance: ₦${debtor.totalOwed.toLocaleString()}.`}`,
          data: {
            debtorId: debtor._id,
            transactionId: incomeTx._id,
            amount: paymentAmount,
            status: debtor.status
          }
        });
      } catch (notifErr) {
        console.error('Failed to create resolution notification:', notifErr);
      }
    }

    res.status(200).json({
      message: debtor.status === 'RESOLVED' ? 'Credit debt fully resolved' : 'Partial payment recorded',
      debtor,
      transaction: incomeTx
    });
  } catch (error) {
    console.error('Error resolving credit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Log a repayment for a debtor (delegates to resolveCredit for consistency)
const logRepayment = async (req, res) => {
  return resolveCredit(req, res);
};

// Log a reminder for a debtor (with 24h cooldown)
const logReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, channel, message } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Merchant email is required' });
    }

    const debtor = await Debtor.findById(id);
    if (!debtor) {
      return res.status(404).json({ message: 'Debtor not found' });
    }

    // Verify merchant ownership
    if (debtor.merchantEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ message: 'Not authorized to remind this debtor' });
    }

    // Validate debtor is active with a phone number
    if (debtor.status === 'RESOLVED' || debtor.status === 'PAID_OFF') {
      return res.status(400).json({ message: 'Cannot remind a paid-off debtor' });
    }
    if (!debtor.phoneNumber) {
      return res.status(400).json({ message: 'Debtor has no phone number' });
    }

    // 24-hour cooldown check
    const COOLDOWN_MS = 24 * 60 * 60 * 1000;
    if (debtor.lastRemindedAt) {
      const elapsed = Date.now() - new Date(debtor.lastRemindedAt).getTime();
      if (elapsed < COOLDOWN_MS) {
        const cooldownEndsAt = new Date(new Date(debtor.lastRemindedAt).getTime() + COOLDOWN_MS);
        return res.status(429).json({
          message: `You already reminded ${debtor.customerName} recently. Try again later.`,
          cooldownEndsAt,
          retryAfterSec: Math.ceil((COOLDOWN_MS - elapsed) / 1000),
        });
      }
    }

    // Record the reminder
    const reminder = {
      sentAt: new Date(),
      channel: channel || 'whatsapp',
      message: message || '',
      amountAtTime: debtor.totalOwed,
    };

    debtor.reminders.push(reminder);
    debtor.lastRemindedAt = reminder.sentAt;
    await debtor.save();

    // Create an in-app notification for the merchant
    try {
      const user = await WelcomeUser.findOne({ email: email.toLowerCase() });
      if (user) {
        await Notification.create({
          user: user._id,
          type: 'credit_reminder',
          title: 'Payment Reminder Sent',
          message: `Reminder sent to ${debtor.customerName} for ₦${debtor.totalOwed.toLocaleString()} via ${channel || 'WhatsApp'}.`,
          data: {
            debtorId: debtor._id,
            customerName: debtor.customerName,
            amount: debtor.totalOwed,
            channel: channel || 'whatsapp',
          },
        });
      }
    } catch (notifErr) {
      console.error('Failed to create reminder notification:', notifErr);
      // Non-blocking: reminder was still logged
    }

    res.status(200).json({
      message: 'Reminder logged successfully',
      reminder: debtor.reminders[debtor.reminders.length - 1],
      lastRemindedAt: debtor.lastRemindedAt,
    });
  } catch (error) {
    console.error('Error logging reminder:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDebtors,
  getDebtorById,
  addCreditTransaction,
  logRepayment,
  resolveCredit,
  logReminder
};
