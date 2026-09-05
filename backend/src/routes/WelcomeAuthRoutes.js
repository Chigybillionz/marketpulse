const express = require('express');
const router = express.Router();
const { handleSignup, handleLogin, setupPin, verifyPin, checkHasPin, uploadProfilePicture, sendResetCode, verifyResetCode, resetPin, resetUserPassword, sendPasswordResetCode, handleUpdateProfile } = require('../controllers/WelcomeAuthController');

// Welcome Page Auth Routes
router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/setup-pin', setupPin);
router.post('/verify-pin', verifyPin);
router.get('/has-pin/:email', checkHasPin);
router.put('/profile-picture', uploadProfilePicture);
router.put('/profile', handleUpdateProfile);

// Forgot PIN Routes
router.post('/forgot-pin/send-code', sendResetCode);
router.post('/forgot-pin/verify-code', verifyResetCode);
router.post('/forgot-pin/reset-pin', resetPin);

// Forgot Password Routes
router.post('/forgot-password/send-code', sendPasswordResetCode);
router.post('/forgot-password/verify-code', verifyResetCode);
router.post('/forgot-password/reset-password', resetUserPassword);

module.exports = router;

