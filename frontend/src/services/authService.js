import apiClient from './api';

/**
 * Signs up a new user with business name, email, and password
 */
export const signup = async (businessName, email, password) => {
  return apiClient('/welcome-auth/signup', {
    method: 'POST',
    body: JSON.stringify({ businessName, email, password }),
  });
};

/**
 * Logs in a user with email and password
 */
export const login = async (email, password) => {
  return apiClient('/welcome-auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

/**
 * Sets up the trade PIN for a user
 */
export const setupPin = async (email, pin) => {
  return apiClient('/welcome-auth/setup-pin', {
    method: 'POST',
    body: JSON.stringify({ email, pin }),
  });
};

/**
 * Uploads a base64 string as the user's profile picture
 */
export const uploadProfilePicture = async (email, profilePicture) => {
  return apiClient('/welcome-auth/profile-picture', {
    method: 'PUT',
    body: JSON.stringify({ email, profilePicture }),
  });
};

/**
 * Verifies a user's trade PIN against the stored hash
 */
export const verifyPin = async (email, pin) => {
  return apiClient('/welcome-auth/verify-pin', {
    method: 'POST',
    body: JSON.stringify({ email, pin }),
  });
};

/**
 * Checks if a user has a trade PIN set
 */
export const checkHasPin = async (email) => {
  return apiClient(`/welcome-auth/has-pin/${encodeURIComponent(email)}`, {
    method: 'GET',
  });
};

/**
 * Sends a 4-digit reset code to the user's email
 */
export const sendResetCode = async (email) => {
  return apiClient('/welcome-auth/forgot-pin/send-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

/**
 * Verifies the 4-digit reset code
 */
export const verifyResetCode = async (email, code) => {
  return apiClient('/welcome-auth/forgot-pin/verify-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
};

/**
 * Sets a new trade PIN using a verified reset code
 */
export const resetPin = async (email, code, newPin) => {
  return apiClient('/welcome-auth/forgot-pin/reset-pin', {
    method: 'POST',
    body: JSON.stringify({ email, code, newPin }),
  });
};
