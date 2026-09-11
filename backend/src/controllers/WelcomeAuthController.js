const { signup, login, setTradePin, verifyTradePin, hasTradePin, generateResetPinCode, verifyResetPinCode, resetTradePin, resetPassword, generateResetPasswordCode, updateProfile } = require('../services/WelcomeAuthService');

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
        profilePicture: user.profilePicture,
        location: user.location,
        businessType: user.businessType,
        category: user.category,
        hasPin: false
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
        profilePicture: user.profilePicture,
        location: user.location,
        businessType: user.businessType,
        category: user.category,
        hasPin: !!user.tradePin
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
    if (error.message === 'PIN already set') {
      return res.status(400).json({ message: 'Trade PIN has already been set. Use your existing PIN.' });
    }
    console.error('Setup PIN Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyPin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ message: 'Email and PIN are required' });
    }

    const isValid = await verifyTradePin(email, pin);

    if (!isValid) {
      return res.status(401).json({ valid: false, message: 'Invalid PIN. Please try again.' });
    }

    res.status(200).json({ valid: true, message: 'PIN verified' });
  } catch (error) {
    console.error('Verify PIN Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const checkHasPin = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const hasPinSet = await hasTradePin(email);
    res.status(200).json({ hasPin: hasPinSet });
  } catch (error) {
    console.error('Check Has PIN Error:', error);
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
        profilePicture: user.profilePicture,
        location: user.location,
        businessType: user.businessType,
        category: user.category
      }
    });
  } catch (error) {
    console.error('Upload Profile Picture Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handleUpdateProfile = async (req, res) => {
  try {
    const { email, businessName, location, businessType } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const updatedUser = await updateProfile(email, { businessName, location, businessType });
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        businessName: updatedUser.businessName,
        location: updatedUser.location,
        businessType: updatedUser.businessType,
        profilePicture: updatedUser.profilePicture
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handleUpdateCategory = async (req, res) => {
  try {
    const { email, category } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const updatedUser = await updateCategory(email, category);
    
    res.status(200).json({
      message: 'Category updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        category: updatedUser.category
      }
    });
  } catch (error) {
    console.error('Update Category Error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const handleUpdateEmail = async (req, res) => {
  try {
    const { email, newEmail } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!newEmail) {
      return res.status(400).json({ message: 'New email is required' });
    }

    const updatedUser = await updateEmail(email, newEmail);
    
    res.status(200).json({
      message: 'Email updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        emailChangeCount: updatedUser.emailChangeCount,
        emailChangeResetDate: updatedUser.emailChangeResetDate
      }
    });
  } catch (error) {
    console.error('Update Email Error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    await generateResetPinCode(email);
    res.status(200).json({ message: 'Reset code sent successfully' });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Send Reset Code Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    await verifyResetPinCode(email, code);
    res.status(200).json({ message: 'Code verified successfully' });
  } catch (error) {
    if (error.message === 'User not found' || error.message === 'Invalid reset code' || error.message === 'Reset code has expired') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Verify Reset Code Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPin = async (req, res) => {
  try {
    const { email, code, newPin } = req.body;
    if (!email || !code || !newPin) {
      return res.status(400).json({ message: 'Email, code, and new PIN are required' });
    }

    if (newPin.length !== 4) {
      return res.status(400).json({ message: 'PIN must be 4 digits' });
    }

    await resetTradePin(email, code, newPin);
    res.status(200).json({ message: 'PIN reset successfully' });
  } catch (error) {
    if (error.message === 'User not found' || error.message === 'Invalid reset code' || error.message === 'Reset code has expired') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Reset PIN Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    await resetPassword(email, code, newPassword);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    if (error.message === 'User not found' || error.message === 'Invalid reset code' || error.message === 'Reset code has expired') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const sendPasswordResetCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    await generateResetPasswordCode(email);
    res.status(200).json({ message: 'Password reset code sent successfully' });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Send Password Reset Code Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const WelcomeUser = require('../models/WelcomeUser');
    const user = await WelcomeUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        businessName: user.businessName,
        profilePicture: user.profilePicture,
        location: user.location,
        businessType: user.businessType,
        category: user.category,
        hasPin: !!user.tradePin
      }
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  handleSignup,
  handleLogin,
  setupPin,
  verifyPin,
  checkHasPin,
  uploadProfilePicture,
  sendResetCode,
  verifyResetCode,
  resetPin,
  resetUserPassword,
  sendPasswordResetCode,
  handleUpdateProfile,
  handleUpdateCategory,
  handleUpdateEmail,
  getProfile
};

