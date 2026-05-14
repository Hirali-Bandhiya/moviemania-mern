const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const plansController = require("../controllers/plansController");

const router = express.Router();

router.get("/", plansController.getAllPlans);
router.get("/:id", plansController.getPlanById);
router.post("/", protect, admin, plansController.createPlan);
router.put("/:id", protect, admin, plansController.updatePlan);
router.delete("/:id", protect, admin, plansController.deletePlan);

module.exports = router;