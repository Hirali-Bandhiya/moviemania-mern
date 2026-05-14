const mongoose = require("mongoose");
const Series = require("../models/Series");

const isForbiddenDemoUrl = (url) => {
  const value = String(url || "").toLowerCase();
  return (
    value.includes("w3schools.com/html/mov_bbb.mp4") ||
    value.includes("gtv-videos-bucket/sample/") ||
    value.includes("commondatastorage.googleapis.com") ||
    value.includes("storage.googleapis.com")
  );
};

const hasForbiddenMediaUrl = (payload = {}) => {
  return isForbiddenDemoUrl(payload.videoUrl) || isForbiddenDemoUrl(payload.trailerUrl) || isForbiddenDemoUrl(payload.trailer);
};

exports.getAllSeries = async (req, res) => {
  try {
    const series = await Series.find();

    if (!series.length) {
      console.log("⚠️  No series found in database");
    }

    res.json(series);
  } catch (error) {
    console.error("Error fetching series:", error);
    res.status(500).json({
      message: "Error fetching series",
      error: error.message,
    });
  }
};

exports.getSeriesById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(200).json(null);
    }

    const series = await Series.findById(id);

    if (!series) {
      return res.status(404).json(null);
    }

    res.json(series);
  } catch (error) {
    console.error("Error fetching series by id:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createSeries = async (req, res) => {
  try {
    if (hasForbiddenMediaUrl(req.body)) {
      return res.status(400).json({ message: "Demo/blocked media URLs are not allowed." });
    }

    const payload = { ...req.body, type: "series" };
    const series = await Series.create(payload);
    res.status(201).json(series);
  } catch (error) {
    res.status(400).json({ message: "Invalid series data", error: error.message });
  }
};

exports.updateSeries = async (req, res) => {
  try {
    if (hasForbiddenMediaUrl(req.body)) {
      return res.status(400).json({ message: "Demo/blocked media URLs are not allowed." });
    }

    const payload = { ...req.body, type: "series" };
    const series = await Series.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!series) return res.status(404).json({ message: "Series not found" });
    res.json(series);
  } catch (error) {
    res.status(400).json({ message: "Error updating series", error: error.message });
  }
};

exports.deleteSeries = async (req, res) => {
  try {
    const series = await Series.findByIdAndDelete(req.params.id);
    if (!series) return res.status(404).json({ message: "Series not found" });
    res.json({ message: "Series deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
