const PortabilityService = require('../services/PortabilityService');
const WelcomeUser = require('../models/WelcomeUser');

/**
 * Check if the user has a trade PIN configured
 */
const checkPinRequirement = async (req, res) => {
  try {
    const userId = req.user?.id;
    const email = req.query?.email || req.body?.email;

    let user = null;
    if (userId) {
      user = await WelcomeUser.findById(userId);
    }
    if (!user && email) {
      user = await WelcomeUser.findOne({ email: String(email).trim().toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      hasPin: !!user.tradePin,
    });
  } catch (error) {
    console.error('Check Pin Requirement Error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * Handle new data export request
 */
const requestExport = async (req, res) => {
  try {
    const userId = req.user?.id;
    const email = req.body?.email || req.query?.email;
    const { format = 'CSV', pin } = req.body;

    const result = await PortabilityService.requestExport(userId, email, format, pin);

    return res.status(200).json({
      success: true,
      message: 'Data export generated successfully',
      exportRecord: result.exportRecord,
      downloadData: result.downloadData,
      fileName: result.fileName,
      mimeType: result.mimeType,
    });
  } catch (error) {
    console.error('Request Export Error:', error);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to generate export',
      requiresPin: error.requiresPin || false,
    });
  }
};

/**
 * Get export history for user
 */
const getHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const email = req.query?.email || req.body?.email;

    const exportsList = await PortabilityService.getUserExports(userId, email);

    return res.status(200).json({
      success: true,
      exports: exportsList,
    });
  } catch (error) {
    console.error('Get Export History Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch export history',
      exports: [],
    });
  }
};

/**
 * Direct file download endpoint
 */
const downloadExport = async (req, res) => {
  try {
    const userId = req.user?.id;
    const email = req.query?.email;
    const { id } = req.params;

    const exportRecord = await PortabilityService.getExportForDownload(userId, email, id);

    const isJson = exportRecord.format === 'JSON';
    const contentType = isJson ? 'application/json' : 'text/csv';

    res.setHeader('Content-Type', `${contentType}; charset=utf-8`);
    res.setHeader('Content-Disposition', `attachment; filename="${exportRecord.fileName}"`);
    return res.status(200).send(exportRecord.downloadData);
  } catch (error) {
    console.error('Download Export Error:', error);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to download export',
    });
  }
};

module.exports = {
  checkPinRequirement,
  requestExport,
  getHistory,
  downloadExport,
};
