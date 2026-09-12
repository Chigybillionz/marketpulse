const express = require('express');
const router = express.Router();
const { protect, protectOrEmail } = require('../middleware/authMiddleware');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  generateSummary,
  getNotificationSettings,
  updateNotificationSettings,
} = require('../controllers/NotificationController');

// Settings routes
router.get('/settings', protectOrEmail, getNotificationSettings);
router.put('/settings', protectOrEmail, updateNotificationSettings);

// All routes are protected (require JWT)
router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);
router.post('/generate-summary', protect, generateSummary);

module.exports = router;
