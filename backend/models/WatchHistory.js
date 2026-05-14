const mongoose = require("mongoose");

const watchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    contentType: {
      type: String,
      enum: ["Movie", "Series"],
      required: true,
      index: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      default: null,
    },
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    progressSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    durationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      default: "player",
    },
  },
  { timestamps: true }
);

watchHistorySchema.index({ user: 1, contentType: 1, contentId: 1 }, { unique: true });

module.exports = mongoose.model("WatchHistory", watchHistorySchema);