const { signup, login, setTradePin } = require('../services/WelcomeAuthService');

const handleSignup = async (req, res) => {
  try {
    const { businessName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { user, token } = await signup(businessName, email, password);

    res.status(201).json({ 
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        businessName: user.businessName,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    if (error.message === 'Email is already registered') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { user, token } = await login(email, password);

    res.status(200).json({ 
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        businessName: user.businessName,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ message: error.message });
    }
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const setupPin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ message: 'Email and PIN are required' });
    }

    if (pin.length !== 4) {
      return res.status(400).json({ message: 'PIN must be 4 digits' });
    }

    const user = await setTradePin(email, pin);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'PIN set successfully' });
  } catch (error) {
    console.error('Setup PIN Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const { email, profilePicture } = req.body;
    
    if (!email || !profilePicture) {
      return res.status(400).json({ message: 'Email and profilePicture are required' });
    }

    const WelcomeUser = require('../models/WelcomeUser');
    const user = await WelcomeUser.findOneAndUpdate(
      { email },
      { profilePicture },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile picture updated successfully',
      user: {
        id: user._id,
        email: user.email,
        businessName: user.businessName,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Upload Profile Picture Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  handleSignup,
  handleLogin,
  setupPin,
  uploadProfilePicture
};
