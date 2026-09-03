const express = require('express');
const router = express.Router();
const { handleSignup, handleLogin, setupPin, verifyPin, checkHasPin, uploadProfilePicture } = require('../controllers/WelcomeAuthController');

// Welcome Page Auth Routes
router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/setup-pin', setupPin);
router.post('/verify-pin', verifyPin);
router.get('/has-pin/:email', checkHasPin);
router.put('/profile-picture', uploadProfilePicture);

module.exports = router;

