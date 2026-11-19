const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const { calculateFinancials, classifyTransaction } = require('../utils/financialEngine');

// @desc    Get transactions for logged in user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get audited financial summary (Profit & Loss, Cash Flow, COGS)
// @route   GET /api/transactions/financial-summary
// @access  Private
const getFinancialSummary = async (req, res) => {
  try {
    const period = req.query.period || 'today';
    const now = new Date();
    let startDate;

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    } else if (period === 'weekly') {
      const day = now.getDay() || 7;
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day + 1);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    } else {
      startDate = new Date(0); // all time
    }

    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: now },
    }).sort({ date: -1 }).lean();

    const products = await Product.find({ user: req.user.id }).lean();
    const summary = calculateFinancials(transactions, { productCatalog: products });

    res.status(200).json({
      period,
      startDate,
      endDate: now,
      transactionCount: transactions.length,
      ...summary,
    });
  } catch (error) {
    console.error('Error in getFinancialSummary:', error);
    res.status(500).json({ message: 'Server Error calculating financial summary' });
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      description,
      date,
      financialClass,
      costPrice,
      quantity,
      cogs,
      productId,
      isCreditRecovery,
      relatedCreditId,
    } = req.body;

    if (!type || !amount || !category || !description) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Auto-detect financial class if not explicitly provided
    const resolvedClass = financialClass || classifyTransaction({
      type,
      category,
      description,
      isCreditRecovery,
    });

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      financialClass: resolvedClass,
      costPrice: costPrice || 0,
      quantity: quantity || 1,
      cogs: cogs || 0,
      productId: productId || null,
      isCreditRecovery: Boolean(isCreditRecovery),
      relatedCreditId: relatedCreditId || null,
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTransactions,
  getFinancialSummary,
  createTransaction,
};
