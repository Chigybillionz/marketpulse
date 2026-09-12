const mongoose = require('mongoose');

const dataExportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WelcomeUser',
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    format: {
      type: String,
      enum: ['CSV', 'JSON'],
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Completed', 'Processing', 'Failed'],
      default: 'Completed',
    },
    downloadData: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user export listing, newest first
dataExportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('DataExport', dataExportSchema);
