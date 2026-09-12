const bcrypt = require('bcryptjs');
const WelcomeUser = require('../models/WelcomeUser');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const Debtor = require('../models/Debtor');
const NotificationSettings = require('../models/NotificationSettings');
const Notification = require('../models/Notification');
const DataExport = require('../models/DataExport');

/**
 * Format bytes into human-readable string (e.g. 4.2 KB, 1.8 MB)
 */
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  if (bytes < k) return `${bytes} B`;
  const kb = bytes / k;
  if (kb < k) return `${kb.toFixed(1)} KB`;
  const mb = kb / k;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Escape string for CSV insertion
 */
function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Collect all data belonging to the authenticated user from the database
 */
async function collectUserData(userId, email) {
  let user = null;
  if (userId) {
    user = await WelcomeUser.findById(userId).lean();
  }
  if (!user && email) {
    user = await WelcomeUser.findOne({ email: String(email).trim().toLowerCase() }).lean();
  }

  if (!user) {
    throw new Error('User account not found');
  }

  const uId = user._id;
  const userEmail = user.email;

  // Query all user-related collections concurrently
  const [products, transactions, debtors, notifSettings, notifications] = await Promise.all([
    Product.find({ user: uId }).sort({ createdAt: -1 }).lean(),
    Transaction.find({ user: uId }).sort({ date: -1 }).lean(),
    Debtor.find({ merchantEmail: userEmail }).sort({ createdAt: -1 }).lean(),
    NotificationSettings.findOne({ user: uId }).lean(),
    Notification.find({ user: uId }).sort({ createdAt: -1 }).limit(50).lean(),
  ]);

  // Clean sensitive fields from user profile
  const sanitizedUser = {
    id: user._id,
    email: user.email,
    businessName: user.businessName || 'N/A',
    location: user.location || 'N/A',
    businessType: user.businessType || 'Retail',
    category: user.category || 'Dry Goods',
    language: user.language || 'English',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: sanitizedUser,
    products,
    transactions,
    debtors,
    notificationSettings: notifSettings || {
      lowStockNotifications: true,
      dailySummary: false,
      dailySummaryTime: '18:00',
      priceChangeAlerts: true,
      threshold: 10,
    },
    notifications,
  };
}

/**
 * Build structured JSON export string
 */
function buildJsonExport(data) {
  const payload = {
    metadata: {
      application: 'MarketPulse AI',
      export_version: '2.0',
      export_timestamp: new Date().toISOString(),
      account_email: data.user.email,
      business_name: data.user.businessName,
      location: data.user.location,
      total_products: data.products.length,
      total_transactions: data.transactions.length,
      total_debtors: data.debtors.length,
      total_notifications: data.notifications.length,
    },
    user: data.user,
    profile: {
      businessName: data.user.businessName,
      location: data.user.location,
      businessType: data.user.businessType,
      category: data.user.category,
      language: data.user.language,
    },
    inventory: data.products.map((p) => ({
      id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      quantityInStock: p.quantityInStock,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    })),
    transactions: data.transactions.map((t) => ({
      id: t._id,
      type: t.type,
      category: t.category,
      amount: t.amount,
      description: t.description,
      date: t.date,
      createdAt: t.createdAt,
    })),
    credit_ledger: data.debtors.map((d) => ({
      id: d._id,
      customerName: d.customerName,
      phoneNumber: d.phoneNumber,
      totalOwed: d.totalOwed,
      dueDate: d.dueDate,
      status: d.status,
      transactions: d.transactions || [],
      createdAt: d.createdAt,
    })),
    settings: {
      lowStockNotifications: data.notificationSettings.lowStockNotifications,
      dailySummary: data.notificationSettings.dailySummary,
      dailySummaryTime: data.notificationSettings.dailySummaryTime,
      priceChangeAlerts: data.notificationSettings.priceChangeAlerts,
      threshold: data.notificationSettings.threshold,
    },
    activity_history: data.notifications.map((n) => ({
      id: n._id,
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt,
    })),
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Build human-readable CSV export string
 */
function buildCsvExport(data) {
  const lines = [];

  // Header & Metadata
  lines.push('# =====================================================================');
  lines.push('# MARKETPULSE AI — USER DATA EXPORT ARCHIVE');
  lines.push(`# Export Generated: ${new Date().toISOString()}`);
  lines.push(`# Account Email: ${data.user.email}`);
  lines.push(`# Store / Business: ${data.user.businessName}`);
  lines.push('# =====================================================================');
  lines.push('');

  // 1. Account Profile
  lines.push('[SECTION: ACCOUNT PROFILE]');
  lines.push('Field,Value');
  lines.push(`Business Name,${escapeCsv(data.user.businessName)}`);
  lines.push(`Account Email,${escapeCsv(data.user.email)}`);
  lines.push(`Store Location,${escapeCsv(data.user.location)}`);
  lines.push(`Business Type,${escapeCsv(data.user.businessType)}`);
  lines.push(`Market Category,${escapeCsv(data.user.category)}`);
  lines.push(`Selected Language,${escapeCsv(data.user.language)}`);
  lines.push(`Member Since,${escapeCsv(data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : 'N/A')}`);
  lines.push('');

  // 2. Inventory Records
  lines.push('[SECTION: INVENTORY & STOCK]');
  lines.push('Product Name,Category,Price (NGN),Quantity in Stock,Last Updated');
  if (data.products.length === 0) {
    lines.push('No products recorded in inventory,,,,');
  } else {
    data.products.forEach((p) => {
      lines.push(
        `${escapeCsv(p.name)},${escapeCsv(p.category)},${p.price || 0},${p.quantityInStock || 0},${escapeCsv(
          p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : ''
        )}`
      );
    });
  }
  lines.push('');

  // 3. Transactions & Trade History
  lines.push('[SECTION: TRANSACTIONS & TRADE HISTORY]');
  lines.push('Date,Transaction Type,Category,Amount (NGN),Description');
  if (data.transactions.length === 0) {
    lines.push('No transactions recorded,,,,');
  } else {
    data.transactions.forEach((t) => {
      lines.push(
        `${escapeCsv(t.date ? new Date(t.date).toLocaleDateString() : '')},${escapeCsv(t.type)},${escapeCsv(
          t.category
        )},${t.amount || 0},${escapeCsv(t.description)}`
      );
    });
  }
  lines.push('');

  // 4. Customer Credit / Debtors
  lines.push('[SECTION: CUSTOMER CREDIT & DEBTORS]');
  lines.push('Customer Name,Phone Number,Total Owed (NGN),Due Date,Status,Credit Entries');
  if (data.debtors.length === 0) {
    lines.push('No debtor records found,,,,,');
  } else {
    data.debtors.forEach((d) => {
      const entriesCount = Array.isArray(d.transactions) ? d.transactions.length : 0;
      lines.push(
        `${escapeCsv(d.customerName)},${escapeCsv(d.phoneNumber || 'N/A')},${d.totalOwed || 0},${escapeCsv(
          d.dueDate ? new Date(d.dueDate).toLocaleDateString() : 'N/A'
        )},${escapeCsv(d.status)},${entriesCount}`
      );
    });
  }
  lines.push('');

  // 5. Notification & Alert Settings
  lines.push('[SECTION: ALERT SETTINGS]');
  lines.push('Low Stock Notifications,Daily Summary,Summary Time,Price Change Alerts,Low Stock Threshold (%)');
  lines.push(
    `${data.notificationSettings.lowStockNotifications ? 'Enabled' : 'Disabled'},${
      data.notificationSettings.dailySummary ? 'Enabled' : 'Disabled'
    },${escapeCsv(data.notificationSettings.dailySummaryTime || '18:00')},${
      data.notificationSettings.priceChangeAlerts ? 'Enabled' : 'Disabled'
    },${data.notificationSettings.threshold || 10}%`
  );
  lines.push('');

  // 6. Activity Notifications
  lines.push('[SECTION: ACTIVITY NOTIFICATIONS]');
  lines.push('Date,Type,Title,Message');
  if (data.notifications.length === 0) {
    lines.push('No notifications recorded,,,');
  } else {
    data.notifications.forEach((n) => {
      lines.push(
        `${escapeCsv(n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '')},${escapeCsv(n.type)},${escapeCsv(
          n.title
        )},${escapeCsv(n.message)}`
      );
    });
  }

  return lines.join('\r\n');
}

/**
 * Request a new data export
 */
async function requestExport(userId, email, format = 'CSV', pin = null) {
  let user = null;
  if (userId) {
    user = await WelcomeUser.findById(userId);
  }
  if (!user && email) {
    user = await WelcomeUser.findOne({ email: String(email).trim().toLowerCase() });
  }

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  // Security Check: If user has a Trade PIN, verify it
  if (user.tradePin) {
    if (!pin) {
      const error = new Error('Trade PIN is required to authorize data export');
      error.status = 401;
      error.requiresPin = true;
      throw error;
    }

    const isMatch = await bcrypt.compare(String(pin).trim(), user.tradePin);
    if (!isMatch) {
      const error = new Error('Invalid Trade PIN. Authorization failed.');
      error.status = 401;
      throw error;
    }
  }

  // Collect user's real data
  const data = await collectUserData(user._id, user.email);

  const normalizedFormat = String(format).toUpperCase() === 'JSON' ? 'JSON' : 'CSV';
  let exportContent = '';

  const today = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();
  const day = String(today.getDate()).padStart(2, '0');

  let fileName = '';
  if (normalizedFormat === 'JSON') {
    exportContent = buildJsonExport(data);
    fileName = `MarketPulse_${data.user.businessName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${month}_${year}.json`;
  } else {
    exportContent = buildCsvExport(data);
    fileName = `Trade_History_${month}_${day}_${year}.csv`;
  }

  const byteSize = Buffer.byteLength(exportContent, 'utf8');
  const formattedSize = formatBytes(byteSize);

  // Save to DataExport collection
  const newExport = await DataExport.create({
    user: user._id,
    userEmail: user.email,
    fileName,
    format: normalizedFormat,
    size: formattedSize,
    sizeBytes: byteSize,
    status: 'Completed',
    downloadData: exportContent,
  });

  return {
    exportRecord: {
      id: newExport._id,
      name: newExport.fileName,
      type: newExport.format,
      date: new Date(newExport.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      size: newExport.size,
      sizeBytes: newExport.sizeBytes,
      status: newExport.status,
      createdAt: newExport.createdAt,
    },
    downloadData: exportContent,
    fileName: newExport.fileName,
    mimeType: normalizedFormat === 'JSON' ? 'application/json' : 'text/csv',
  };
}

/**
 * Get export history for authenticated user
 */
async function getUserExports(userId, email) {
  let user = null;
  if (userId) {
    user = await WelcomeUser.findById(userId);
  }
  if (!user && email) {
    user = await WelcomeUser.findOne({ email: String(email).trim().toLowerCase() });
  }

  if (!user) {
    return [];
  }

  const records = await DataExport.find({ user: user._id })
    .sort({ createdAt: -1 })
    .select('-downloadData')
    .lean();

  return records.map((rec) => ({
    id: rec._id,
    name: rec.fileName,
    type: rec.format,
    date: new Date(rec.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    size: rec.size,
    sizeBytes: rec.sizeBytes,
    status: rec.status,
    createdAt: rec.createdAt,
  }));
}

/**
 * Retrieve a specific export file for download (strict user data isolation)
 */
async function getExportForDownload(userId, email, exportId) {
  let user = null;
  if (userId) {
    user = await WelcomeUser.findById(userId);
  }
  if (!user && email) {
    user = await WelcomeUser.findOne({ email: String(email).trim().toLowerCase() });
  }

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  const exportRecord = await DataExport.findOne({ _id: exportId, user: user._id });
  if (!exportRecord) {
    const error = new Error('Export record not found or access denied');
    error.status = 404;
    throw error;
  }

  return exportRecord;
}

module.exports = {
  collectUserData,
  buildJsonExport,
  buildCsvExport,
  requestExport,
  getUserExports,
  getExportForDownload,
};
