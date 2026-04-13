const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
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
    nationalId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    donationCount: {
      type: Number,
      default: 0,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    source: {
      type: String,
      enum: ["user", "employee"],
      default: "user",
    },
    donations: {
      type: [
        {
          donationDate: {
            type: Date,
            required: true,
          },
          notes: {
            type: String,
            default: "",
            trim: true,
          },
          employeeName: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],
      default: [],
    },
    updateHistory: {
      type: [
        {
          updatedAt: {
            type: Date,
            default: Date.now,
          },
          employeeName: {
            type: String,
            default: "",
            trim: true,
          },
          fullName: {
            type: String,
            default: "",
            trim: true,
          },
          email: {
            type: String,
            default: "",
            trim: true,
            lowercase: true,
          },
          phone: {
            type: String,
            default: "",
            trim: true,
          },
          governorate: {
            type: String,
            default: "",
            trim: true,
          },
          notes: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", donorSchema);