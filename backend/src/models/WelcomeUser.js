const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const WelcomeUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    trim: true
  },
  tradePin: {
    type: String
  },
  location: {
    type: String,
    trim: true
  },
  businessType: {
    type: String,
    enum: ['Retail', 'Wholesale', 'Wholesale & Retail'],
    default: 'Retail'
  },
  category: {
    type: String,
    trim: true,
    default: 'Dry Goods'
  },
  profilePicture: {
    type: String,
    default: ""
  },
  language: {
    type: String,
    enum: ['English', 'Pidgin', 'Yoruba', 'Igbo', 'Hausa'],
    default: 'English'
  },
  resetPinCode: {
    type: String
  },
  resetPinExpires: {
    type: Date
  },
  // Email change rate limiting
  emailChangeCount: {
    type: Number,
    default: 0
  },
  emailChangeResetDate: {
    type: Date
  },
  // Account deletion lifecycle
  deletionStatus: {
    type: String,
    enum: ['ACTIVE', 'PENDING_DELETION', 'DELETED'],
    default: 'ACTIVE'
  },
  deletionRequestedAt: {
    type: Date
  },
  gracePeriodEndDate: {
    type: Date
  }
}, { timestamps: true });

// Hash password and PIN before saving
WelcomeUserSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  if (this.isModified('tradePin') && this.tradePin) {
    const salt = await bcrypt.genSalt(10);
    this.tradePin = await bcrypt.hash(this.tradePin, salt);
  }
});

module.exports = mongoose.model('WelcomeUser', WelcomeUserSchema);
