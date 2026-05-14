const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    guestName: {
      type: String,
      default: null
    },
    guestEmail: {
      type: String,
      default: null
    },
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    paymentId: {
      type: String,
      required: true,
      unique: true
    },
    transactionId: {
      type: String,
      default: null
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    plan: {
      type: String,
      required: true
    },
    planRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null
    },
    status: {
      type: String,
      enum: ["Success", "Failed", "Pending", "Cancelled"],
      default: "Success"
    },
    paymentMethod: {
      type: String,
      enum: ["Razorpay", "Credit Card", "Debit Card", "UPI", "Wallet", "Net Banking"],
      default: "Razorpay"
    },
    description: {
      type: String,
      default: null
    },
    transactionDate: {
      type: Date,
      default: Date.now
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    subscriptionEndDate: {
      type: Date
    }
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, transactionDate: -1 });
paymentSchema.index({ planRef: 1, transactionDate: -1 });
paymentSchema.index({ userId: 1, paymentDate: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
