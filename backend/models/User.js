const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const paymentHistoryEntrySchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      default: null,
    },
    paymentId: {
      type: String,
      default: null,
    },
    planName: {
      type: String,
      default: null,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },
    amount: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const subscriptionHistoryEntrySchema = new mongoose.Schema(
  {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },
    planName: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "active",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
  },
  { _id: false }
);

const currentSubscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },
    planName: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["inactive", "active", "expired", "cancelled"],
      default: "inactive",
    },
    startedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Guest", "User", "Admin"],
    default: "User"
  },
  isRegistered: {
    type: Boolean,
    default: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  plan: {
    type: String,
    default: "Basic"
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie"
  }],
  subscriptionPlan: {
    type: String, // e.g. 'Basic', 'Standard', 'Premium'
    default: null
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  subscriptionExpiryDate: {
    type: Date,
    default: null
  },
  subscriptionActive: {
    type: Boolean,
    default: false
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  currentSubscription: {
    type: currentSubscriptionSchema,
    default: () => ({})
  },
  subscriptionHistory: {
    type: [subscriptionHistoryEntrySchema],
    default: []
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: String
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpire: {
    type: Date,
    default: null
  },
  resetOTP: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  paymentHistory: {
    type: [paymentHistoryEntrySchema],
    default: []
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
