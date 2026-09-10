const WelcomeUser = require('../models/WelcomeUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const EmailService = require('./EmailService');

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

  // Allow overwriting an existing PIN since verification happens client-side for change PIN.

  user.tradePin = pin;
  await user.save();
  return user;
};

/**
 * Updates the user's profile details
 */
const updateProfile = async (email, profileData) => {
  const user = await WelcomeUser.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (profileData.businessName !== undefined) {
    user.businessName = profileData.businessName;
  }
  if (profileData.location !== undefined) {
    user.location = profileData.location;
  }
  if (profileData.businessType !== undefined) {
    user.businessType = profileData.businessType;
  }
  if (profileData.category !== undefined) {
    user.category = profileData.category;
  }

  await user.save();
  return user;
};

/**
 * Updates the user's market category
 */
const updateCategory = async (email, category) => {
  const user = await WelcomeUser.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  user.category = category;
  await user.save();
  return user;
};

/**
 * Updates the user's email with rate limiting (max 3 changes per week)
 */
const updateEmail = async (email, newEmail) => {
  const user = await WelcomeUser.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  // Check if rate limit reset date has passed
  if (user.emailChangeResetDate && now > user.emailChangeResetDate) {
    // Reset the counter
    user.emailChangeCount = 0;
    user.emailChangeResetDate = null;
  }

  // Enforce rate limit: max 3 changes per week
  if (user.emailChangeCount >= 3) {
    const daysUntilReset = Math.ceil((user.emailChangeResetDate - now) / (24 * 60 * 60 * 1000));
    throw new Error(`Email can only be changed 3 times per week. Please wait ${daysUntilReset} more day(s).`);
  }

  // Check if new email is already taken
  const existingUser = await WelcomeUser.findOne({ email: newEmail });
  if (existingUser && existingUser._id.toString() !== user._id.toString()) {
    throw new Error('This email is already registered');
  }

  // Update email and increment counter
  user.email = newEmail.toLowerCase().trim();
  user.emailChangeCount += 1;
  
  // Set reset date to 7 days from now if this is the 3rd change
  if (user.emailChangeCount >= 3) {
    user.emailChangeResetDate = new Date(now.getTime() + oneWeekMs);
  }

  await user.save();
  return user;
};

/**
 * Verifies a trade PIN against the stored hash
 */
const verifyTradePin = async (email, pin) => {
  const user = await WelcomeUser.findOne({ email });
  if (!user || !user.tradePin) return false;

  const isMatch = await bcrypt.compare(pin, user.tradePin);
  return isMatch;
};

/**
 * Checks if a user has a trade PIN set
 */
const hasTradePin = async (email) => {
  const user = await WelcomeUser.findOne({ email });
  if (!user) return false;
  return !!user.tradePin;
};

/**
 * Generates a 4-digit reset code and sends it via email
 */
const generateResetPinCode = async (email) => {
  const user = await WelcomeUser.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Generate a 4-digit numeric OTP
  const code = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });

  // Save to user model with a 10-minute expiration
  user.resetPinCode = code;
  user.resetPinExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  // Send the email
  await EmailService.sendResetCodeEmail(email, code);

  return true;
};

/**
 * Verifies if the reset code is valid and not expired
 */
const verifyResetPinCode = async (email, code) => {
  const user = await WelcomeUser.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.resetPinCode || user.resetPinCode !== code) {
    throw new Error('Invalid reset code');
  }

  if (new Date() > user.resetPinExpires) {
    throw new Error('Reset code has expired');
  }

  return true;
};

/**
 * Overwrites the trade PIN using a verified reset code
 */
const resetTradePin = async (email, code, newPin) => {
  // First verify the code is still valid
  await verifyResetPinCode(email, code);

  const user = await WelcomeUser.findOne({ email });

  user.tradePin = newPin;
  // Clear the reset fields
  user.resetPinCode = undefined;
  user.resetPinExpires = undefined;

  await user.save();
  return user;
};

/**
 * Overwrites the account password using a verified reset code
 */
const resetPassword = async (email, code, newPassword) => {
  await verifyResetPinCode(email, code);

  const user = await WelcomeUser.findOne({ email });
  user.password = newPassword;
  user.resetPinCode = undefined;
  user.resetPinExpires = undefined;

  await user.save();
  return user;
};

/**
 * Generates a 4-digit reset code for password reset and sends it via email
 */
const generateResetPasswordCode = async (email) => {
  const user = await WelcomeUser.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const code = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });

  user.resetPinCode = code;
  user.resetPinExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await EmailService.sendPasswordResetCodeEmail(email, code);

  return true;
};

module.exports = {
  signup,
  login,
  setTradePin,
  verifyTradePin,
  hasTradePin,
  generateResetPinCode,
  verifyResetPinCode,
  resetTradePin,
  resetPassword,
  generateResetPasswordCode,
  updateProfile,
  updateCategory,
  updateEmail
};
