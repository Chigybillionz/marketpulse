const Notification = require('../models/Notification');
const NotificationSettings = require('../models/NotificationSettings');
const WelcomeUser = require('../models/WelcomeUser');
const Product = require('../models/Product');

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Get Unread Count Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    notification.read = true;
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    console.error('Mark As Read Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark All As Read Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a single notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await notification.deleteOne();
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Generate a daily inventory summary notification
// @route   POST /api/notifications/generate-summary
// @access  Private
const generateSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all products for this user
    const products = await Product.find({ user: userId });

    const totalProducts = products.length;
    const userSettings = await NotificationSettings.findOne({ user: userId });
    const threshold = userSettings?.threshold || 10; // User-configured or default low-stock threshold

    // Compute inventory stats
    let totalStockValue = 0;
    let totalUnits = 0;
    const lowStockItems = [];
    const categoryBreakdown = {};

    for (const product of products) {
      const qty = product.quantityInStock || 0;
      const price = product.price || 0;
      totalStockValue += qty * price;
      totalUnits += qty;

      if (qty <= threshold) {
        lowStockItems.push({
          name: product.name,
          category: product.category,
          quantityInStock: qty,
          price: price,
        });
      }

      const cat = product.category || 'Other';
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { count: 0, totalStock: 0, totalValue: 0 };
      }
      categoryBreakdown[cat].count += 1;
      categoryBreakdown[cat].totalStock += qty;
      categoryBreakdown[cat].totalValue += qty * price;
    }

    // Sort low-stock items by quantity (most critical first)
    lowStockItems.sort((a, b) => a.quantityInStock - b.quantityInStock);

    const summaryData = {
      totalProducts,
      totalUnits,
      totalStockValue,
      lowStockCount: lowStockItems.length,
      lowStockItems: lowStockItems.slice(0, 10), // Top 10 most critical
      categoryBreakdown,
      generatedAt: new Date().toISOString(),
    };

    // Build the notification message
    let message = `Your inventory summary is ready. You have ${totalProducts} product${totalProducts !== 1 ? 's' : ''} with ${totalUnits} total units in stock.`;
    if (lowStockItems.length > 0) {
      message += ` ${lowStockItems.length} item${lowStockItems.length !== 1 ? 's are' : ' is'} below the low-stock threshold.`;
    }

    const notification = await Notification.create({
      user: userId,
      type: 'daily_summary',
      title: 'Daily Inventory Summary',
      message,
      data: summaryData,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Generate Summary Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Helper to resolve user ID from req.user or fallback email
const resolveUserId = async (req) => {
  if (req.user?.id) {
    return req.user.id;
  }
  const email = req.query?.email || req.body?.email;
  if (email) {
    const user = await WelcomeUser.findOne({ email });
    if (user) return user._id;
  }
  return null;
};

// @desc    Get notification settings for the authenticated user
// @route   GET /api/notifications/settings
// @access  Private
const getNotificationSettings = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    let settings = await NotificationSettings.findOne({ user: userId });

    if (!settings) {
      settings = await NotificationSettings.create({
        user: userId,
        lowStockNotifications: true,
        dailySummary: false,
        dailySummaryTime: '18:00',
        priceChangeAlerts: true,
        threshold: 10,
      });
    }

    res.status(200).json({
      success: true,
      settings: {
        lowStockNotifications: settings.lowStockNotifications,
        dailySummary: settings.dailySummary,
        dailySummaryTime: settings.dailySummaryTime,
        priceChangeAlerts: settings.priceChangeAlerts,
        threshold: settings.threshold,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get Notification Settings Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update notification settings for the authenticated user
// @route   PUT /api/notifications/settings
// @access  Private
const updateNotificationSettings = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const {
      lowStockNotifications,
      dailySummary,
      dailySummaryTime,
      priceChangeAlerts,
      threshold,
    } = req.body;

    // Validate dailySummaryTime format if provided
    if (dailySummaryTime !== undefined && dailySummaryTime !== '') {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (typeof dailySummaryTime !== 'string' || !timeRegex.test(dailySummaryTime)) {
        return res.status(400).json({ message: 'Invalid time format (HH:MM expected)' });
      }
    }

    // Validate threshold if provided
    if (threshold !== undefined) {
      const thresholdNum = Number(threshold);
      if (isNaN(thresholdNum) || thresholdNum < 1 || thresholdNum > 100) {
        return res.status(400).json({ message: 'Threshold must be a percentage between 1 and 100' });
      }
    }

    const updateData = {};
    if (lowStockNotifications !== undefined) updateData.lowStockNotifications = Boolean(lowStockNotifications);
    if (dailySummary !== undefined) updateData.dailySummary = Boolean(dailySummary);
    if (dailySummaryTime !== undefined && dailySummaryTime !== '') updateData.dailySummaryTime = dailySummaryTime;
    if (priceChangeAlerts !== undefined) updateData.priceChangeAlerts = Boolean(priceChangeAlerts);
    if (threshold !== undefined) updateData.threshold = Number(threshold);

    const settings = await NotificationSettings.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Notification settings updated successfully',
      settings: {
        lowStockNotifications: settings.lowStockNotifications,
        dailySummary: settings.dailySummary,
        dailySummaryTime: settings.dailySummaryTime,
        priceChangeAlerts: settings.priceChangeAlerts,
        threshold: settings.threshold,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update Notification Settings Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  generateSummary,
  getNotificationSettings,
  updateNotificationSettings,
};
