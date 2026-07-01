const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5001/api/welcome-auth';

/**
 * Requests an OTP for a given phone number and business name
 */
export const requestOTP = async (phoneNumber, businessName) => {
  try {
    const response = await fetch(`${API_URL}/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, businessName }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to request OTP');
    }

    return data;
  } catch (error) {
    console.error('Auth Service - Request OTP Error:', error);
    throw error;
  }
};

/**
 * Verifies the OTP for a given phone number
 */
export const verifyOTP = async (phoneNumber, otp) => {
  try {
    const response = await fetch(`${API_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invalid or expired OTP');
    }

    return data;
  } catch (error) {
    console.error('Auth Service - Verify OTP Error:', error);
    throw error;
  }
};

/**
 * Sets up the trade PIN for a user
 */
export const setupPin = async (phoneNumber, pin) => {
  try {
    const response = await fetch(`${API_URL}/setup-pin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, pin }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to set up PIN');
    }

    return data;
  } catch (error) {
    console.error('Auth Service - Setup PIN Error:', error);
    throw error;
  }
};
