const Notification = require('../models/Notification');
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
    const threshold = 10; // Default low-stock threshold

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

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  generateSummary,
};
