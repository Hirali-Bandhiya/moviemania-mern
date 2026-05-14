const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { createOrder, verifyPayment, getAllPayments, getPaymentsFromDB } = require("../controllers/paymentController");
const { createPaymentRecord } = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/all", protect, admin, getAllPayments);
router.get("/records/all", protect, admin, getPaymentsFromDB);
router.post("/records", createPaymentRecord);

module.exports = router;
