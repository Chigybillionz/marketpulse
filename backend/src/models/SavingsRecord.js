const mongoose = require('mongoose');

const savingsRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'WelcomeUser',
      index: true,
    },
    dayKey: {
      type: String, // 'YYYY-MM-DD'
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    financialSnapshot: {
      salesRevenue: { type: Number, default: 0 },
      cogs: { type: Number, default: 0 },
      operatingExpenses: { type: Number, default: 0 },
      netProfit: { type: Number, default: 0 },
      totalCashInflow: { type: Number, default: 0 },
      totalCashOutflow: { type: Number, default: 0 },
      netCashFlow: { type: Number, default: 0 },
      availableCash: { type: Number, default: 0 },
    },
    recommendation: {
      status: {
        type: String,
        enum: ['SAVE_TODAY', 'SAVE_SMALLER', 'DO_NOT_SAVE'],
        default: 'SAVE_TODAY',
      },
      recommendedAmount: {
        type: Number,
        default: 0,
      },
      reason: {
        type: String,
        trim: true,
      },
      profitPercentage: {
        type: Number,
        default: 20,
      },
    },
    userAction: {
      status: {
        type: String,
        enum: ['PENDING', 'SAVED', 'SKIPPED', 'CUSTOM_SAVED'],
        default: 'PENDING',
      },
      actualSavedAmount: {
        type: Number,
        default: 0,
      },
      savedAt: {
        type: Date,
      },
      notes: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: only 1 savings record per user per day
savingsRecordSchema.index({ user: 1, dayKey: 1 }, { unique: true });

module.exports = mongoose.model('SavingsRecord', savingsRecordSchema);
