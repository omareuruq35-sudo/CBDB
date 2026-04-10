const mongoose = require("mongoose");

const emergencyAdSchema = new mongoose.Schema(
  {
    bloodType: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    governorate: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      enum: [6, 12, 24, 48, 72],
    },
    createdAtDate: {
      type: Date,
      default: Date.now,
    },
    expiresAtDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EmergencyAd", emergencyAdSchema);