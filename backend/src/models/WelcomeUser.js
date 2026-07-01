const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const WelcomeUserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  businessName: {
    type: String,
    trim: true
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  tradePin: {
    type: String
  }
}, { timestamps: true });

// Hash PIN before saving
WelcomeUserSchema.pre('save', async function() {
  if (!this.isModified('tradePin') || !this.tradePin) return;

  const salt = await bcrypt.genSalt(10);
  this.tradePin = await bcrypt.hash(this.tradePin, salt);
});

module.exports = mongoose.model('WelcomeUser', WelcomeUserSchema);
