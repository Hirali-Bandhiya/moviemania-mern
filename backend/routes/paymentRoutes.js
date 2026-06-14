const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { createOrder, verifyPayment, getAllPayments, getPaymentsFromDB, getMyPayments } = require("../controllers/paymentController");
const { createPaymentRecord } = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/me", protect, getMyPayments);
router.get("/all", protect, admin, getAllPayments);
router.get("/records/all", protect, admin, getPaymentsFromDB);
router.post("/records", protect, createPaymentRecord);

module.exports = router;
