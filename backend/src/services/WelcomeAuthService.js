const otpGenerator = require('otp-generator');
const WelcomeUser = require('../models/WelcomeUser');

/**
 * Generates a 4-digit OTP and sets expiration for 2 minutes
 */
const generateWelcomeOTP = async (phoneNumber, businessName) => {
  const otp = otpGenerator.generate(4, { 
    upperCaseAlphabets: false, 
    specialChars: false, 
    lowerCaseAlphabets: false 
  });
  
  // Set expiration to 2 minutes from now
  const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

  let user = await WelcomeUser.findOne({ phoneNumber });

  if (user) {
    user.otp = otp;
    user.otpExpires = otpExpires;
    user.businessName = businessName || user.businessName;
    await user.save();
  } else {
    user = await WelcomeUser.create({
      phoneNumber,
      businessName,
      otp,
      otpExpires
    });
  }

  // NOTE: In production, integrate with SMS provider (Twilio, etc.)
  console.log("\n-------------------------------------------");
  console.log(`🔑 OTP REQUEST RECEIVED`);
  console.log(`📱 Phone: ${phoneNumber}`);
  console.log(`🔢 CODE:  ${otp}`);
  console.log(`⏰ Expires at: ${otpExpires.toLocaleTimeString()}`);
  console.log("-------------------------------------------\n");
  
  return otp;
};

/**
 * Verifies if the provided OTP is valid and not expired
 */
const verifyWelcomeOTP = async (phoneNumber, otp) => {
  const user = await WelcomeUser.findOne({ 
    phoneNumber, 
    otp, 
    otpExpires: { $gt: Date.now() } 
  });

  if (!user) return false;

  // Clear OTP after successful verification
  user.otp = undefined;
  user.otpExpires = undefined;
  user.isVerified = true;
  await user.save();

  return user;
};

/**
 * Sets the trade PIN for a verified user
 */
const setTradePin = async (phoneNumber, pin) => {
  const user = await WelcomeUser.findOne({ phoneNumber, isVerified: true });
  if (!user) return null;

  user.tradePin = pin;
  await user.save();
  return user;
};

module.exports = {
  generateWelcomeOTP,
  verifyWelcomeOTP,
  setTradePin
};
