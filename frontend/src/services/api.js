const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'https://marketpulse-jaxo.onrender.com/api';

/**
 * A central wrapper around fetch that automatically includes the JWT token
 * in the Authorization header for all authenticated requests.
 */
export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.error || data.message || 'API request failed');
      error.status = response.status;
      if (data.retryAfterSec) error.retryAfterSec = data.retryAfterSec;
      const retryAfterHeader = response.headers?.get?.('retry-after');
      if (retryAfterHeader) error.retryAfterSec = parseInt(retryAfterHeader, 10) || error.retryAfterSec;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

export default apiClient;
