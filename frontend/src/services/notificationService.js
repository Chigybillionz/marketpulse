import apiClient from './api';

/**
 * Fetches all notifications for the authenticated user (newest first, max 50)
 */
export const getNotifications = async () => {
  return apiClient('/notifications', { method: 'GET' });
};

/**
 * Gets the count of unread notifications
 */
export const getUnreadCount = async () => {
  return apiClient('/notifications/unread-count', { method: 'GET' });
};

/**
 * Marks a single notification as read
 */
export const markAsRead = async (id) => {
  return apiClient(`/notifications/${id}/read`, { method: 'PUT' });
};

/**
 * Marks all notifications as read
 */
export const markAllAsRead = async () => {
  return apiClient('/notifications/read-all', { method: 'PUT' });
};

/**
 * Deletes a single notification
 */
export const deleteNotification = async (id) => {
  return apiClient(`/notifications/${id}`, { method: 'DELETE' });
};

/**
 * Generates a daily inventory summary notification on the server
 */
export const generateSummary = async () => {
  return apiClient('/notifications/generate-summary', { method: 'POST' });
};
