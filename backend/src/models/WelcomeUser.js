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
  profilePicture: {
    type: String,
    default: ""
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
