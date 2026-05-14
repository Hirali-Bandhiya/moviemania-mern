const mongoose = require("mongoose");
const Movie = require("./models/Movie");
const Series = require("./models/Series");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/moviemania";

const isForbiddenDemoUrl = (url) => {
  const value = String(url || "").toLowerCase();
  return (
    value.includes("w3schools.com/html/mov_bbb.mp4") ||
    value.includes("gtv-videos-bucket/sample/") ||
    value.includes("commondatastorage.googleapis.com") ||
    value.includes("storage.googleapis.com")
  );
};

const cleanDocument = async (doc) => {
  let changed = false;

  if (isForbiddenDemoUrl(doc.videoUrl)) {
    doc.videoUrl = "";
    changed = true;
  }

  if (isForbiddenDemoUrl(doc.trailerUrl)) {
    doc.trailerUrl = "";
    changed = true;
  }

  if (isForbiddenDemoUrl(doc.trailer)) {
    doc.trailer = "";
    changed = true;
  }

  if (changed) {
    await doc.save();
    return 1;
  }

  return 0;
};

const cleanupCollection = async (Model, label) => {
  const docs = await Model.find({});
  let updated = 0;

  for (const doc of docs) {
    updated += await cleanDocument(doc);
  }

  console.log(`${label}: scanned ${docs.length}, cleaned ${updated}`);
  return updated;
};

const runCleanup = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for media cleanup");

    const cleanedMovies = await cleanupCollection(Movie, "Movies");
    const cleanedSeries = await cleanupCollection(Series, "Series");

    console.log(`Cleanup complete. Total cleaned: ${cleanedMovies + cleanedSeries}`);
  } catch (error) {
    console.error("Cleanup failed:", error.message || error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

runCleanup();
