const mongoose = require("mongoose");

const seriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    image: {
      type: String,
    },
    trailerUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    duration: {
      type: Number,
    },
    type: {
      type: String,
      default: "series",
      enum: ["series"],
    },
    industry: {
      type: String,
      default: "Hollywood",
      enum: ["Hollywood", "Bollywood"],
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    cast: {
      type: [String],
    },
    director: {
      type: String,
    },
      requirePlanForAccess: {
        type: Boolean,
        default: false,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Series", seriesSchema);
