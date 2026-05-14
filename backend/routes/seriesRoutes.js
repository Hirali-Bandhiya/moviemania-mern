const express = require("express");
const {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
} = require("../controllers/seriesController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getAllSeries)
  .post(protect, admin, createSeries);

router
  .route("/:id")
  .get(getSeriesById)
  .put(protect, admin, updateSeries)
  .delete(protect, admin, deleteSeries);

module.exports = router;
