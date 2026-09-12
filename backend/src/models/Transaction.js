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
