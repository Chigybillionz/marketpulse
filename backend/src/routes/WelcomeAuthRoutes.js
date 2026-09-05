const express = require('express');
const router = express.Router();
const { handleSignup, handleLogin, setupPin, verifyPin, checkHasPin, uploadProfilePicture, sendResetCode, verifyResetCode, resetPin } = require('../controllers/WelcomeAuthController');

// Welcome Page Auth Routes
router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/setup-pin', setupPin);
router.post('/verify-pin', verifyPin);
router.get('/has-pin/:email', checkHasPin);
router.put('/profile-picture', uploadProfilePicture);

// Forgot PIN Routes
router.post('/forgot-pin/send-code', sendResetCode);
router.post('/forgot-pin/verify-code', verifyResetCode);
router.post('/forgot-pin/reset-pin', resetPin);

module.exports = router;

