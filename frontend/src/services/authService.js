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
 * Updates the user's business profile (businessName, location, businessType)
 */
export const updateProfile = async (email, profileData) => {
  return apiClient('/welcome-auth/profile', {
    method: 'PUT',
    body: JSON.stringify({ email, ...profileData }),
  });
};

/**
 * Updates the user's market category
 */
export const updateCategory = async (email, category) => {
  return apiClient('/welcome-auth/category', {
    method: 'PUT',
    body: JSON.stringify({ email, category }),
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
 * Gets a user's full profile
 */
export const getUserProfile = async (email) => {
  return apiClient(`/welcome-auth/profile/${encodeURIComponent(email)}`, {
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

/**
 * Sends a 4-digit reset code to the user's email (for password reset)
 */
export const sendPasswordResetCode = async (email) => {
  return apiClient('/welcome-auth/forgot-password/send-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

/**
 * Verifies the 4-digit password reset code
 */
export const verifyPasswordResetCode = async (email, code) => {
  return apiClient('/welcome-auth/forgot-password/verify-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
};

/**
 * Resets the account password using a verified code
 */
export const resetPassword = async (email, code, newPassword) => {
  return apiClient('/welcome-auth/forgot-password/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, code, newPassword }),
  });
};

/**
 * Updates the user's preferred language in the backend
 */
export const updateLanguage = async (email, language) => {
  return apiClient('/welcome-auth/language', {
    method: 'PUT',
    body: JSON.stringify({ email, language }),
  });
};

/**
 * Submits an account deletion request requiring typing "DELETE"
 */
export const requestAccountDeletion = async (confirmationText, email = null) => {
  return apiClient('/welcome-auth/request-deletion', {
    method: 'POST',
    body: JSON.stringify({ confirmationText, email }),
  });
};

/**
 * Cancels a pending account deletion within the 3-day grace period
 */
export const cancelAccountDeletion = async (email = null) => {
  return apiClient('/welcome-auth/cancel-deletion', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

/**
 * Fetches the current account deletion status
 */
export const getDeletionStatus = async (email) => {
  return apiClient(`/welcome-auth/deletion-status/${encodeURIComponent(email)}`, {
    method: 'GET',
  });
};

/**
 * Fetches real-time profile dashboard metrics (weekly growth & inventory alerts)
 */
export const getProfileMetrics = async (email) => {
  return apiClient(`/welcome-auth/profile-metrics?email=${encodeURIComponent(email)}`, {
    method: 'GET',
  });
};
