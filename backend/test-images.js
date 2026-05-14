#!/usr/bin/env node

/**
 * Quick test script to verify movie images are loading
 * Usage: node test-images.js
 */

const Movie = require("./models/Movie");
const mongoose = require("mongoose");

async function testImages() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/moviemania");
    console.log("✅ Connected to MongoDB\n");

    const movies = await Movie.find().select("title image -_id");
    console.log("📸 Movie Images Test:\n");

    movies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title}`);
      console.log(`   URL: ${movie.image}`);
      console.log(`   Valid: ${movie.image && movie.image.startsWith("http") ? "✅" : "❌"}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testImages();
