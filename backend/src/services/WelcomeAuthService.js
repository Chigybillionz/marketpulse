const WelcomeUser = require('../models/WelcomeUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d',
  });
};

const signup = async (businessName, email, password) => {
  const existingUser = await WelcomeUser.findOne({ email });
  if (existingUser) {
    throw new Error('Email is already registered');
  }

  const user = await WelcomeUser.create({
    businessName,
    email,
    password
  });

  const token = generateToken(user._id);
  return { user, token };
};

const login = async (email, password) => {
  const user = await WelcomeUser.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);
  return { user, token };
};

/**
 * Sets the trade PIN for a verified user
 */
const setTradePin = async (email, pin) => {
  const user = await WelcomeUser.findOne({ email });
  if (!user) return null;

  user.tradePin = pin;
  await user.save();
  return user;
};

module.exports = {
  signup,
  login,
  setTradePin
};
