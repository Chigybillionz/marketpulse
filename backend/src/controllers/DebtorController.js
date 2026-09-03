const Debtor = require('../models/Debtor');

// Get all debtors for a merchant
const getDebtors = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Merchant email is required' });
    }

    const debtors = await Debtor.find({ merchantEmail: email }).sort({ updatedAt: -1 });
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

    let debtor = await Debtor.findOne({ merchantEmail: email, customerName: { $regex: new RegExp(`^${customerName}$`, 'i') } });

    const transaction = {
      type: 'CREDIT_SALE',
      amount,
      description,
      date: new Date()
    };

    if (debtor) {
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
        totalOwed: Number(amount),
        dueDate: dueDate ? new Date(dueDate) : null,
        transactions: [transaction]
      });
      await debtor.save();
    }

    res.status(201).json(debtor);
  } catch (error) {
    console.error('Error adding credit transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Log a repayment for a debtor
const logRepayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Repayment amount is required' });
    }

    const debtor = await Debtor.findById(id);
    if (!debtor) {
      return res.status(404).json({ message: 'Debtor not found' });
    }

    const transaction = {
      type: 'REPAYMENT',
      amount,
      description,
      date: new Date()
    };

    debtor.totalOwed = Math.max(0, debtor.totalOwed - Number(amount));
    debtor.transactions.push(transaction);

    if (debtor.totalOwed === 0) {
      debtor.status = 'PAID_OFF';
    }

    await debtor.save();

    res.status(200).json(debtor);
  } catch (error) {
    console.error('Error logging repayment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDebtors,
  getDebtorById,
  addCreditTransaction,
  logRepayment
};
