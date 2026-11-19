const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'WelcomeUser',
    },
    type: {
      type: String,
      required: [true, 'Please specify Income or Expense'],
      enum: ['Income', 'Expense'],
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    source: {
      type: String,
      trim: true,
    },
    relatedCreditId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Debtor',
    },
    isCreditRecovery: {
      type: Boolean,
      default: false,
    },
    financialClass: {
      type: String,
      enum: [
        'SALES_REVENUE',
        'CREDIT_SALE',
        'CREDIT_REPAYMENT',
        'LOAN_BORROWED',
        'CAPITAL_INJECTION',
        'OTHER_INCOME',
        'INVENTORY_RESTOCK',
        'OPERATING_EXPENSE',
        'PERSONAL_WITHDRAWAL',
        'LOAN_LENT',
        'LOAN_REPAYMENT',
        'OTHER_EXPENSE',
      ],
      default: null,
    },
    costPrice: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    cogs: {
      type: Number,
      default: 0,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
