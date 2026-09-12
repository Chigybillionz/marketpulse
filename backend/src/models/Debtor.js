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

const reminderSchema = new mongoose.Schema({
  sentAt: {
    type: Date,
    default: Date.now
  },
  channel: {
    type: String,
    enum: ['whatsapp', 'sms', 'email'],
    default: 'whatsapp'
  },
  message: {
    type: String,
    trim: true
  },
  amountAtTime: {
    type: Number
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
  originalAmount: {
    type: Number,
    default: function() {
      return this.totalOwed;
    }
  },
  resolvedAmount: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PARTIALLY_PAID', 'RESOLVED', 'PAID_OFF'],
    default: 'ACTIVE'
  },
  resolvedAt: {
    type: Date
  },
  transactions: [creditTransactionSchema],
  reminders: [reminderSchema],
  lastRemindedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Debtor = mongoose.model('Debtor', debtorSchema);
module.exports = Debtor;
