import apiClient from './api';

/**
 * Check if the authenticated user has a Trade PIN configured
 */
export const checkPinRequirement = async (email) => {
  const query = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient(`/portability/check-pin${query}`, {
    method: 'GET',
  });
};

/**
 * Fetch all export history records for the current user
 */
export const getExportHistory = async (email) => {
  const query = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient(`/portability/history${query}`, {
    method: 'GET',
  });
};

/**
 * Request a new data export with optional Trade PIN authorization
 */
export const requestDataExport = async (format = 'CSV', pin = null, email = null) => {
  return apiClient('/portability/export', {
    method: 'POST',
    body: JSON.stringify({
      format,
      pin,
      email,
    }),
  });
};

/**
 * Download a previously saved export file
 */
export const downloadExportFile = async (exportId, fileName, email = null) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'https://marketpulse-jaxo.onrender.com/api';
    const token = localStorage.getItem('token');
    const query = email ? `?email=${encodeURIComponent(email)}` : '';

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/portability/download/${exportId}${query}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to download file (${response.status})`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'MarketPulse_Export';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Error downloading export file:', err);
    throw err;
  }
};
