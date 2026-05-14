const express = require("express");
const { registerUser, loginUser, paymentSuccess, forgotPassword, sendOtp, verifyOtp, resetPasswordWithOtp, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPasswordWithOtp);
router.post("/reset-password/:token", resetPassword);
router.post("/payment-success", protect, paymentSuccess);

module.exports = router;
