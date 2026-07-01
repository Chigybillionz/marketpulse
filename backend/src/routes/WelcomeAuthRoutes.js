const express = require('express');
const router = express.Router();
const { requestOTP, verifyOTP, setupPin } = require('../controllers/WelcomeAuthController');

// Welcome Page Auth Routes
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/setup-pin', setupPin);

module.exports = router;
