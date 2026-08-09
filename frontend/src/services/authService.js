import apiClient from './api';

/**
 * Requests an OTP for a given phone number and business name
 */
export const requestOTP = async (phoneNumber, businessName) => {
  return apiClient('/welcome-auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, businessName }),
  });
};

/**
 * Verifies the OTP for a given phone number
 */
export const verifyOTP = async (phoneNumber, otp) => {
  return apiClient('/welcome-auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, otp }),
  });
};

/**
 * Sets up the trade PIN for a user
 */
export const setupPin = async (phoneNumber, pin) => {
  return apiClient('/welcome-auth/setup-pin', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, pin }),
  });
};
