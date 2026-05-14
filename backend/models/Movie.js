const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  year: {
    type: Number
  },
  rating: {
    type: Number
  },
  image: {
    type: String
  },
  trailerUrl: {
    type: String
  },
  videoUrl: {
    type: String
  },
  duration: {
    type: Number // in seconds
  },
  type: {
    type: String,
    default: "movie"
  },
  trending: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  },
  cast: {
    type: [String]
  },
  director: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
