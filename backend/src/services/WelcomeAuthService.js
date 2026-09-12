const WelcomeUser = require('../models/WelcomeUser');
const DeletionRequest = require('../models/DeletionRequest');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
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

  // Check account deletion status
  if (user.deletionStatus === 'DELETED') {
    const error = new Error('This account has been permanently deleted.');
    error.status = 403;
    throw error;
  }

  if (user.deletionStatus === 'PENDING_DELETION') {
    const now = new Date();
    const canRestore = user.gracePeriodEndDate && now <= new Date(user.gracePeriodEndDate);
    const error = new Error(
      canRestore
        ? 'Your account is pending deletion. You can restore your account within the grace period.'
        : 'This account has been deactivated and is scheduled for permanent erasure.'
    );
    error.status = 403;
    error.pendingDeletion = true;
    error.canRestore = canRestore;
    error.gracePeriodEndDate = user.gracePeriodEndDate;
    throw error;
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
  if (profileData.language !== undefined) {
    user.language = profileData.language;
  }

  await user.save();
  return user;
};

/**
 * Updates the user's preferred application language
 */
const updateLanguage = async (email, language) => {
  const allowed = ['English', 'Pidgin', 'Yoruba', 'Igbo', 'Hausa'];
  if (!allowed.includes(language)) {
    throw new Error(`Invalid language. Allowed: ${allowed.join(', ')}`);
  }
  const user = await WelcomeUser.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  user.language = language;
  await user.save();
  return user;
};

/**
 * Updates the user's market category
 */
const updateCategory = async (email, category) => {
  if (typeof category !== 'string' || category.trim().length === 0) {
    throw new Error('Category must be a non-empty string');
  }
  if (category.length > 50) {
    throw new Error('Category must be under 50 characters');
  }

  const user = await WelcomeUser.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  user.category = category.trim();
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

/**
 * Request account deletion with confirmation requirement
 */
const requestAccountDeletion = async (userId, email, confirmationText) => {
  if (!confirmationText || String(confirmationText).trim().toUpperCase() !== 'DELETE') {
    const error = new Error('You must type "DELETE" exactly to confirm account deletion.');
    error.status = 400;
    throw error;
  }

  let user = null;
  if (userId) {
    user = await WelcomeUser.findById(userId);
  }
  if (!user && email) {
    user = await WelcomeUser.findOne({ email: String(email).trim().toLowerCase() });
  }

  if (!user) {
    const error = new Error('User account not found');
    error.status = 404;
    throw error;
  }

  // Grace period: 3 days. Scheduled total erasure: 30 days.
  const now = new Date();
  const gracePeriodEndDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const scheduledDeletionDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Update user model
  user.deletionStatus = 'PENDING_DELETION';
  user.deletionRequestedAt = now;
  user.gracePeriodEndDate = gracePeriodEndDate;
  await user.save();

  // Create or update DeletionRequest document
  const deletionRequest = await DeletionRequest.findOneAndUpdate(
    { user: user._id },
    {
      user: user._id,
      userEmail: user.email,
      requestDate: now,
      gracePeriodEndDate,
      scheduledDeletionDate,
      status: 'PENDING_DELETION',
      cancellationStatus: false,
      cancelledAt: null,
    },
    { upsert: true, new: true }
  );

  return {
    success: true,
    message: 'Account deletion request submitted. Your account is now deactivated.',
    deletionRequest: {
      id: deletionRequest._id,
      status: deletionRequest.status,
      requestDate: deletionRequest.requestDate,
      gracePeriodEndDate: deletionRequest.gracePeriodEndDate,
      scheduledDeletionDate: deletionRequest.scheduledDeletionDate,
    },
  };
};

/**
 * Cancel a pending account deletion within the 3-day grace period
 */
const cancelAccountDeletion = async (userId, email) => {
  let user = null;
  if (userId) {
    user = await WelcomeUser.findById(userId);
  }
  if (!user && email) {
    user = await WelcomeUser.findOne({ email: String(email).trim().toLowerCase() });
  }

  if (!user) {
    const error = new Error('User account not found');
    error.status = 404;
    throw error;
  }

  const deletionRequest = await DeletionRequest.findOne({ user: user._id, status: 'PENDING_DELETION' });
  if (!deletionRequest) {
    const error = new Error('No active deletion request found for this account.');
    error.status = 404;
    throw error;
  }

  const now = new Date();
  if (now > new Date(deletionRequest.gracePeriodEndDate)) {
    const error = new Error('The 3-day grace period has expired. This deletion request can no longer be cancelled.');
    error.status = 400;
    throw error;
  }

  // Restore user to active
  user.deletionStatus = 'ACTIVE';
  user.deletionRequestedAt = null;
  user.gracePeriodEndDate = null;
  await user.save();

  // Mark deletion request cancelled
  deletionRequest.status = 'CANCELLED';
  deletionRequest.cancellationStatus = true;
  deletionRequest.cancelledAt = now;
  await deletionRequest.save();

  return {
    success: true,
    message: 'Deletion request cancelled successfully. Your account and data have been fully restored.',
  };
};

/**
 * Get current deletion status for account
 */
const getDeletionStatus = async (userId, email) => {
  let user = null;
  if (userId) {
    user = await WelcomeUser.findById(userId);
  }
  if (!user && email) {
    user = await WelcomeUser.findOne({ email: String(email).trim().toLowerCase() });
  }

  if (!user) {
    return { status: 'ACTIVE', hasRequest: false };
  }

  const deletionRequest = await DeletionRequest.findOne({ user: user._id }).sort({ createdAt: -1 });

  return {
    deletionStatus: user.deletionStatus || 'ACTIVE',
    hasRequest: !!deletionRequest && deletionRequest.status === 'PENDING_DELETION',
    requestDate: deletionRequest?.requestDate || null,
    gracePeriodEndDate: deletionRequest?.gracePeriodEndDate || null,
    scheduledDeletionDate: deletionRequest?.scheduledDeletionDate || null,
    canCancel: deletionRequest ? new Date() <= new Date(deletionRequest.gracePeriodEndDate) : false,
  };
};

/**
 * Returns real-time profile dashboard metrics for the authenticated user:
 * - weeklyGrowth: percentage change in income this week vs last week
 * - lowStockCount: number of products where quantityInStock <= lowStockThreshold
 * - lowStockItems: top 5 low-stock product names for display
 */
const getProfileMetrics = async (userId) => {
  const now = new Date();

  // Calculate week boundaries (Monday-based)
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - daysSinceMonday);
  currentWeekStart.setHours(0, 0, 0, 0);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(currentWeekStart.getDate() - 7);

  const previousWeekEnd = new Date(currentWeekStart); // exclusive end

  // Aggregate income transactions for current and previous week in parallel
  const [currentWeekAgg, previousWeekAgg] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'Income',
          date: { $gte: currentWeekStart, $lte: now },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'Income',
          date: { $gte: previousWeekStart, $lt: previousWeekEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const currentTotal = currentWeekAgg.length > 0 ? currentWeekAgg[0].total : 0;
  const previousTotal = previousWeekAgg.length > 0 ? previousWeekAgg[0].total : 0;

  let weeklyGrowth = 0;
  if (previousTotal > 0) {
    weeklyGrowth = ((currentTotal - previousTotal) / previousTotal) * 100;
  } else if (currentTotal > 0) {
    // If no previous data but current has data, show 100% growth
    weeklyGrowth = 100;
  }
  // If both are 0, growth stays at 0

  // Find products where stock is at or below the threshold
  const lowStockProducts = await Product.find({
    user: userId,
    $expr: { $lte: ['$quantityInStock', '$lowStockThreshold'] },
  })
    .select('name quantityInStock lowStockThreshold')
    .sort({ quantityInStock: 1 })
    .limit(10)
    .lean();

  return {
    weeklyGrowth: Math.round(weeklyGrowth * 10) / 10, // 1 decimal place
    currentWeekIncome: currentTotal,
    previousWeekIncome: previousTotal,
    lowStockCount: lowStockProducts.length,
    lowStockItems: lowStockProducts.slice(0, 5).map((p) => ({
      name: p.name,
      quantity: p.quantityInStock,
      threshold: p.lowStockThreshold,
    })),
  };
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
  updateEmail,
  updateLanguage,
  requestAccountDeletion,
  cancelAccountDeletion,
  getDeletionStatus,
  getProfileMetrics,
};
