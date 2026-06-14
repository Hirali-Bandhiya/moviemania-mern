const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const Payment = require("../models/Payment");
const Plan = require("../models/Plan");

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const getRazorpayClient = () => {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
};

const isObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(String(value || ""));

const resolvePlanDocument = async (planValue) => {
  const normalizedPlan = String(planValue || "").trim();
  if (!normalizedPlan) {
    return null;
  }

  if (isObjectId(normalizedPlan)) {
    const planById = await Plan.findById(normalizedPlan);
    if (planById) {
      return planById;
    }
  }

  return Plan.findOne({
    $or: [
      { planCode: normalizedPlan },
      { name: normalizedPlan },
    ],
  });
};

const calculateSubscriptionEndDate = (startDate = new Date()) => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);
  return endDate;
};

const syncUserSubscription = (user, planValue, planDoc, paymentRecord = null, subscriptionEndDate = null) => {
  const planName = String(planValue || planDoc?.name || planDoc?.planCode || "Basic").trim();
  const currentStartedAt = user.currentSubscription?.startedAt || new Date();

  // Keep legacy and Razorpay-ready subscription fields in sync.
  user.plan = planName;
  user.subscriptionPlan = planName;
  user.subscriptionStartDate = currentStartedAt;
  user.subscriptionEndDate = subscriptionEndDate || user.subscriptionEndDate || null;
  user.subscriptionExpiryDate = subscriptionEndDate || user.subscriptionExpiryDate || null;
  user.subscriptionActive = true;
  user.subscriptionExpiry = subscriptionEndDate || user.subscriptionExpiry || null;
  user.isPaid = true;
  user.currentSubscription = {
    plan: planDoc?._id || user.currentSubscription?.plan || null,
    planName,
    status: "active",
    startedAt: currentStartedAt,
    expiresAt: subscriptionEndDate || user.currentSubscription?.expiresAt || null,
    autoRenew: Boolean(user.currentSubscription?.autoRenew),
    payment: paymentRecord?._id || user.currentSubscription?.payment || null,
  };

  if (planDoc) {
    user.subscriptionHistory.push({
      plan: planDoc._id,
      planName,
      status: "active",
      startedAt: currentStartedAt,
      endedAt: subscriptionEndDate || null,
      payment: paymentRecord?._id || null,
    });
  }
};

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { amount, planId, planName } = req.body;
    const planDoc = await resolvePlanDocument(planId || planName);
    const amountInRupees = Number(amount || planDoc?.pricing?.monthly || 0);
    const razorpay = getRazorpayClient();

    if (!Number.isFinite(amountInRupees) || amountInRupees <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    if (!razorpay) {
      const mockOrder = {
        id: `order_mock_${Date.now()}`,
        amount: Math.round(amountInRupees * 100),
        currency: planDoc?.pricing?.currency || "INR",
      };

      console.log("Razorpay keys missing. Using mock order for local testing:", mockOrder);

      return res.json({
        mockMode: true,
        order: mockOrder,
        keyId: null,
        message: "Razorpay keys missing. Continuing in mock payment mode.",
        plan: {
          id: String(planDoc?._id || planId || ""),
          name: planDoc?.name || planName || "Basic",
          amount: amountInRupees,
        },
      });
    }

    const options = {
      amount: Math.round(amountInRupees * 100),
      currency: planDoc?.pricing?.currency || "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId: String(planDoc?._id || planId || ""),
        planName: String(planDoc?.name || planName || ""),
      },
    };

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created:", {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planId: options.notes.planId,
      planName: options.notes.planName,
    });

    return res.json({
      order,
      keyId: RAZORPAY_KEY_ID,
      plan: {
        id: String(planDoc?._id || planId || ""),
        name: planDoc?.name || planName || "Basic",
        amount: amountInRupees,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      planName,
      planPrice,
      amount,
      mockPayment,
    } = req.body;

    console.log("Razorpay payment verification payload:", {
      razorpay_order_id,
      razorpay_payment_id,
      hasSignature: Boolean(razorpay_signature),
      planId,
      planName,
      amount,
    });

    if (!RAZORPAY_KEY_SECRET) {
      if (!mockPayment) {
        return res.status(500).json({ message: "Razorpay secret key is missing" });
      }
    } else {
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid Razorpay signature" });
      }
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const planDoc = await resolvePlanDocument(planId || planName);
    const paymentDate = new Date();
    const subscriptionEndDate = calculateSubscriptionEndDate(paymentDate);
    const resolvedAmount = Number(amount || planPrice || planDoc?.pricing?.monthly || 0);

    const paymentRecord = await Payment.create({
      userId: user._id,
      user: user._id,
      razorpay_order_id,
      razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      transactionId: razorpay_payment_id,
      amount: resolvedAmount,
      subscriptionPlan: planDoc?.name || planName || "Basic",
      currency: planDoc?.pricing?.currency || "INR",
      plan: planDoc?.name || planName || "Basic",
      planName: planDoc?.name || planName || "Basic",
      planRef: planDoc?._id || null,
      planId: planDoc?._id || null,
      status: "Success",
      paymentStatus: "Success",
      paymentMethod: "Razorpay",
      paymentDate,
      transactionDate: paymentDate,
      subscriptionEndDate,
      description: `${planDoc?.name || planName || "Basic"} plan subscription payment`,
    });

    syncUserSubscription(user, planDoc?.name || planName || "Basic", planDoc, paymentRecord, subscriptionEndDate);

    user.paymentHistory.push({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      plan: planDoc?._id || null,
      planName: planDoc?.name || planDoc?.planCode || planName || "Basic",
      amount: resolvedAmount,
      status: "Success",
      paymentMethod: "Razorpay",
      subscriptionEndDate,
      date: paymentDate,
    });

    await user.save();

    return res.status(200).json({
      message: "Payment verified successfully",
      payment: paymentRecord,
      user: {
        _id: user._id,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionEndDate: user.subscriptionEndDate,
        subscriptionExpiryDate: user.subscriptionExpiryDate,
        subscriptionActive: user.subscriptionActive,
        subscriptionExpiry: user.subscriptionExpiry,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get payments for the signed-in user
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate("user", "name email")
      .sort({ paymentDate: -1, transactionDate: -1, createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const users = await User.find({ "paymentHistory.0": { $exists: true } }).select("name email paymentHistory");
    
    // Flatten payment history for all users
    const allPayments = users.flatMap(user => 
      user.paymentHistory.map(payment => ({
        user: { name: user.name, email: user.email },
        ...payment
      }))
    );

    res.json(allPayments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all payments from Payment collection
exports.getPaymentsFromDB = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .sort({ transactionDate: -1 });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create payment record in Payment collection
exports.createPaymentRecord = async (req, res) => {
  try {
    const { user, guestName, guestEmail, orderId, paymentId, transactionId, amount, currency, plan, planId, status, paymentMethod, description, paymentDate } = req.body;

    if (!orderId || !paymentId || !amount || !plan) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const paymentTimestamp = paymentDate ? new Date(paymentDate) : new Date();
    const subscriptionEndDate = calculateSubscriptionEndDate(paymentTimestamp);
    const planDoc = await resolvePlanDocument(plan);

    const newPayment = await Payment.create({
      userId: user || null,
      user: user || null,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      guestName: guestName || null,
      guestEmail: guestEmail || null,
      orderId,
      paymentId,
      transactionId: transactionId || paymentId,
      amount,
      subscriptionPlan: plan,
      planName: plan,
      currency: currency || "INR",
      plan,
      planId: planId || planDoc?._id || null,
      planRef: planDoc?._id || null,
      status: status || "Success",
      paymentStatus: status || "Success",
      paymentMethod: paymentMethod || "Razorpay",
      description,
      paymentDate: paymentTimestamp,
      transactionDate: paymentTimestamp,
      subscriptionEndDate,
    });

    if (user) {
      const userDoc = await User.findById(user);
      if (userDoc) {
        syncUserSubscription(userDoc, plan, planDoc, newPayment, subscriptionEndDate);
        userDoc.paymentHistory.push({
          orderId,
          paymentId,
          plan: planDoc?._id || null,
          planName: planDoc?.name || planDoc?.planCode || plan,
          amount,
          status: status || "Success",
          paymentMethod: paymentMethod || "Razorpay",
          subscriptionEndDate,
          date: new Date(),
        });

        await userDoc.save();
      }
    }

    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
