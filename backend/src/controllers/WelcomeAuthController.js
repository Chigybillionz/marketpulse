const { generateWelcomeOTP, verifyWelcomeOTP, setTradePin } = require('../services/WelcomeAuthService');

/**
 * Handles initial phone submission from Welcome Page
 */
const requestOTP = async (req, res) => {
  console.log(">>> [CONTROLLER] Entering requestOTP");
  try {
    const { phoneNumber, businessName } = req.body;
    console.log(`>>> [CONTROLLER] Request Body: phone=${phoneNumber}, business=${businessName}`);

    if (!phoneNumber) {
      console.log(">>> [CONTROLLER] Error: Missing phone number");
      return res.status(400).json({ message: 'Phone number is required' });
    }

    console.log(">>> [CONTROLLER] Calling generateWelcomeOTP service...");
    await generateWelcomeOTP(phoneNumber, businessName);
    console.log(">>> [CONTROLLER] Service call finished successfully.");

    res.status(200).json({ 
      message: 'OTP sent successfully. It will expire in 2 minutes.' 
    });
  } catch (error) {
    console.error('>>> [CONTROLLER] Request OTP Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Handles OTP verification
 */
const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    const user = await verifyWelcomeOTP(phoneNumber, otp);

    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ 
      message: 'OTP verified successfully',
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        businessName: user.businessName
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Handles PIN setup
 */
const setupPin = async (req, res) => {
  try {
    const { phoneNumber, pin } = req.body;

    if (!phoneNumber || !pin) {
      return res.status(400).json({ message: 'Phone number and PIN are required' });
    }

    if (pin.length !== 4) {
      return res.status(400).json({ message: 'PIN must be 4 digits' });
    }

    const user = await setTradePin(phoneNumber, pin);

    if (!user) {
      return res.status(404).json({ message: 'User not found or not verified' });
    }

    res.status(200).json({ message: 'PIN set successfully' });
  } catch (error) {
    console.error('Setup PIN Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  requestOTP,
  verifyOTP,
  setupPin
};
