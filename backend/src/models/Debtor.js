const mongoose = require('mongoose');

const creditTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['CREDIT_SALE', 'REPAYMENT'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  }
});

const debtorSchema = new mongoose.Schema({
  merchantEmail: {
    type: String,
    required: true,
    index: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  totalOwed: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAID_OFF'],
    default: 'ACTIVE'
  },
  transactions: [creditTransactionSchema]
}, {
  timestamps: true
});

const Debtor = mongoose.model('Debtor', debtorSchema);
module.exports = Debtor;
