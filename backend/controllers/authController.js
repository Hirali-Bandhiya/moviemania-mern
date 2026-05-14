const User = require("../models/User");
const Plan = require("../models/Plan");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findUserByEmail = async (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    return null;
  }

  return User.findOne({
    email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
  });
};

// Generate JWT setup
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

const resolvePlanDocument = async (planValue) => {
  const normalizedPlan = String(planValue || "").trim();
  if (!normalizedPlan) {
    return null;
  }

  return Plan.findOne({
    $or: [
      { planCode: normalizedPlan },
      { name: normalizedPlan },
    ],
  });
};

const buildPasswordResetEmail = (resetUrl) => `
  <div style="font-family: Arial, sans-serif; background: #f6f6f6; padding: 24px;">
    <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0 0 16px; color: #111827;">Password Reset</h2>
      <p style="margin: 0 0 24px; color: #374151; line-height: 1.6;">We received a request to reset your MovieMania password. Click the button below to choose a new password. This link expires in 15 minutes.</p>
      <a href="${resetUrl}" style="display: inline-block; background: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 700;">Reset Password</a>
      <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">If the button does not work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #2563eb; font-size: 14px;">${resetUrl}</p>
    </div>
  </div>
`;

const buildOtpEmail = (otp) => `
  <div style="font-family: Arial, sans-serif; background: #f6f6f6; padding: 24px;">
    <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
      <h2 style="margin: 0 0 16px; color: #111827;">Password Reset OTP</h2>
      <p style="margin: 0 0 24px; color: #374151; line-height: 1.6;">Use the OTP below to verify your password reset request. It expires in 10 minutes.</p>
      <div style="display: inline-block; background: #f3f4f6; border: 1px solid #e5e7eb; color: #111827; font-size: 28px; font-weight: 700; letter-spacing: 6px; padding: 16px 24px; border-radius: 10px;">${otp}</div>
      <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">If you did not request this reset, you can ignore this email.</p>
    </div>
  </div>
`;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const clearOtpFields = (user) => {
  user.resetOTP = null;
  user.otpExpiry = null;
};


// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, referredBy } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    const userExists = await findUserByEmail(normalizedEmail);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const referralCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      referralCode,
      referredBy,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        referralCode: user.referralCode,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Auth User & get token
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        referralCode: user.referralCode,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionEndDate: user.subscriptionEndDate,
        currentSubscription: user.currentSubscription,
        isPaid: user.isPaid,
        wishlist: user.wishlist,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const sendPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('[auth] sendPasswordResetOtp called for:', email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    const otp = generateOtp();

    // set OTP and expiry
    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      html: buildOtpEmail(otp),
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.forgotPassword = sendPasswordResetOtp;

exports.sendOtp = sendPasswordResetOtp;

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('[auth] verifyOtp called for:', email, 'otp:', otp && '***');

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    const enteredOtp = String(otp).trim();
    const storedOtp = String(user.resetOTP || "").trim();
    const otpIsValid = storedOtp && enteredOtp === storedOtp && user.otpExpiry && user.otpExpiry.getTime() > Date.now();

    if (!otpIsValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log('[auth] resetPasswordWithOtp called for:', email);

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    if (!user.resetOTP || !user.otpExpiry || user.otpExpiry.getTime() <= Date.now()) {
      return res.status(400).json({ message: "OTP is missing or expired" });
    }

    user.password = String(newPassword);
    clearOtpFields(user);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    clearOtpFields(user);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const planDoc = await resolvePlanDocument(req.body.plan);
      const subscriptionStartDate = user.currentSubscription?.startedAt || user.subscriptionStartDate || new Date();
      const subscriptionEndDate = user.currentSubscription?.expiresAt || user.subscriptionEndDate || new Date(subscriptionStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      user.isPaid = true;
      user.plan = req.body.plan || "Basic";
      user.subscriptionPlan = req.body.plan || user.subscriptionPlan;
      user.subscriptionStartDate = subscriptionStartDate;
      user.subscriptionEndDate = subscriptionEndDate;
      user.currentSubscription = {
        plan: planDoc?._id || user.currentSubscription?.plan || null,
        planName: planDoc?.name || planDoc?.planCode || req.body.plan || "Basic",
        status: "active",
        startedAt: subscriptionStartDate,
        expiresAt: subscriptionEndDate,
        autoRenew: Boolean(user.currentSubscription?.autoRenew),
        payment: user.currentSubscription?.payment || null,
      };

      if (planDoc) {
        user.subscriptionHistory.push({
          plan: planDoc._id,
          planName: planDoc.name || planDoc.planCode,
          status: "active",
          startedAt: user.currentSubscription.startedAt,
          endedAt: null,
          payment: user.currentSubscription.payment || null,
        });
      }

      await user.save();
      res.json({ success: true, isPaid: user.isPaid, plan: user.plan });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
