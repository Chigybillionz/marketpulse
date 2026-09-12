const mongoose = require('mongoose');

const deletionRequestSchema = new mongoose.Schema(
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
    requestDate: {
      type: Date,
      default: Date.now,
    },
    gracePeriodEndDate: {
      type: Date,
      required: true,
    },
    scheduledDeletionDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING_DELETION', 'CANCELLED', 'COMPLETED'],
      default: 'PENDING_DELETION',
    },
    cancellationStatus: {
      type: Boolean,
      default: false,
    },
    cancelledAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    reason: {
      type: String,
      default: 'User requested account erasure',
    },
  },
  {
    timestamps: true,
  }
);

deletionRequestSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('DeletionRequest', deletionRequestSchema);
