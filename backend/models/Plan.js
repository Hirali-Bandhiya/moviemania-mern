const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    planCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    planName: {
      type: String,
      default: null,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      default: null,
    },
    duration: {
      type: Number,
      default: 30,
    },
    pricing: {
      monthly: {
        type: Number,
        required: true,
      },
      yearly: {
        type: Number,
        default: null,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
    features: {
      type: [String],
      default: [],
    },
    limits: {
      quality: {
        type: String,
        default: "HD",
      },
      screens: {
        type: Number,
        default: 1,
      },
      downloads: {
        type: Number,
        default: 0,
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

planSchema.index({ planCode: 1 }, { unique: true });

module.exports = mongoose.model("Plan", planSchema);