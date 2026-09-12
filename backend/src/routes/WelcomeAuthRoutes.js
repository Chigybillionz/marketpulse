const express = require('express');
const router = express.Router();
const { handleSignup, handleLogin, setupPin, verifyPin, checkHasPin, uploadProfilePicture, sendResetCode, verifyResetCode, resetPin, resetUserPassword, sendPasswordResetCode, handleUpdateProfile, handleUpdateCategory, handleUpdateEmail, handleUpdateLanguage, getProfile, handleRequestDeletion, handleCancelDeletion, handleGetDeletionStatus, handleGetProfileMetrics } = require('../controllers/WelcomeAuthController');
const { protectOrEmail } = require('../middleware/authMiddleware');

// Welcome Page Auth Routes
router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/setup-pin', setupPin);
router.post('/verify-pin', verifyPin);
router.get('/has-pin/:email', checkHasPin);
router.get('/profile/:email', getProfile);
router.put('/profile-picture', uploadProfilePicture);
router.put('/profile', handleUpdateProfile);
router.put('/category', handleUpdateCategory);
router.put('/email', handleUpdateEmail);
router.put('/language', handleUpdateLanguage);

// Account Deletion & Lifecycle Routes
router.post('/request-deletion', protectOrEmail, handleRequestDeletion);
router.post('/cancel-deletion', protectOrEmail, handleCancelDeletion);
router.get('/deletion-status/:email', protectOrEmail, handleGetDeletionStatus);

// Profile Dashboard Metrics
router.get('/profile-metrics', protectOrEmail, handleGetProfileMetrics);

// Forgot PIN Routes
router.post('/forgot-pin/send-code', sendResetCode);
router.post('/forgot-pin/verify-code', verifyResetCode);
router.post('/forgot-pin/reset-pin', resetPin);

// Forgot Password Routes
router.post('/forgot-password/send-code', sendPasswordResetCode);
router.post('/forgot-password/verify-code', verifyResetCode);
router.post('/forgot-password/reset-password', resetUserPassword);

module.exports = router;

