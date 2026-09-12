const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WelcomeUser',
      required: true,
      unique: true,
      index: true,
    },
    lowStockNotifications: {
      type: Boolean,
      default: true,
    },
    dailySummary: {
      type: Boolean,
      default: false,
    },
    dailySummaryTime: {
      type: String,
      default: '18:00',
      trim: true,
    },
    priceChangeAlerts: {
      type: Boolean,
      default: true,
    },
    threshold: {
      type: Number,
      default: 10,
      min: 1,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('NotificationSettings', notificationSettingsSchema);
