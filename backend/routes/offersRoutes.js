const express = require("express");
const router = express.Router();
const offersController = require("../controllers/offersController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", offersController.getAllOffers);

// Admin protected routes
router.get("/admin/all", protect, admin, offersController.getAdminOffers);
router.post("/", protect, admin, offersController.createOffer);
router.put("/:id", protect, admin, offersController.updateOffer);
router.delete("/:id", protect, admin, offersController.deleteOffer);

// Public single offer route
router.get("/:id", offersController.getOfferById);

module.exports = router;
