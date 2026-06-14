const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const { decorateContentAccess } = require("../utils/accessControl");

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

// Get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};

    if (type) {
      filter.type = String(type).toLowerCase();
    }

    const movies = await Movie.find(filter);
    
    if (!movies.length) {
      console.log("⚠️  No movies found in database", { filter });
    }
    
    res.json(movies.map(decorateContentAccess));
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ 
      message: "Error fetching movies",
      error: error.message 
    });
  }
};

// Get movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    // If NOT valid ObjectId → return dummy safe response
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(200).json(null);
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json(null);
    }

    res.json(decorateContentAccess(movie));
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create movie
exports.createMovie = async (req, res) => {
  try {
    if (hasForbiddenMediaUrl(req.body)) {
      return res.status(400).json({ message: "Demo/blocked media URLs are not allowed." });
    }

    const movie = await Movie.create(req.body);
    console.log("[MOVIE_CREATE] Inserted movie", {
      id: String(movie._id),
      title: movie.title,
      genre: movie.genre,
      videoUrl: movie.videoUrl || null,
      type: movie.type || null,
    });
    res.status(201).json(decorateContentAccess(movie));
  } catch (error) {
    res.status(400).json({ message: "Invalid movie data", error: error.message });
  }
};

// Update movie
exports.updateMovie = async (req, res) => {
  try {
    if (hasForbiddenMediaUrl(req.body)) {
      return res.status(400).json({ message: "Demo/blocked media URLs are not allowed." });
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    console.log("[MOVIE_UPDATE] Updated movie", {
      id: String(movie._id),
      title: movie.title,
      genre: movie.genre,
      videoUrl: movie.videoUrl || null,
      type: movie.type || null,
    });

    res.json(decorateContentAccess(movie));
  } catch (error) {
    res.status(400).json({ message: "Error updating movie", error: error.message });
  }
};

// Delete movie
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
