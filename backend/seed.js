const mongoose = require("mongoose");
const Movie = require("./models/Movie");

// Sample movies with placeholder image URLs
const sampleMovies = [
  // ================= ACTION MOVIES =================
  {
    title: "The Dark Knight",
    genre: "Action",
    year: 2008,
    rating: 9.0,
    image: "darkknight.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    duration: 9120,
    type: "movie",
    description: "When the menace known as The Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests.",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
  },
  {
    title: "Avengers",
    genre: "Action",
    year: 2019,
    rating: 8.4,
    trending: true,
    image: "avengers.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=hA6hldpSTF8",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    type: "movie",
    description: "Earth's mightiest heroes must come together and learn to fight as a team to prevent an alien invasion.",
    director: "Joss Whedon",
    cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"]
  },
  {
    title: "Pathaan",
    genre: "Action",
    year: 2023,
    rating: 7.5,
    image: "pathaan.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=p1j5fJn5Bg4",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    type: "movie",
    description: "An ex-intelligence officer is drawn into a dangerous game of cat-and-mouse.",
    director: "Siddharth Anand",
    cast: ["Shah Rukh Khan", "Deepika Padukone"]
  },
  {
    title: "John Wick",
    genre: "Action",
    year: 2014,
    rating: 8.0,
    image: "johnwick.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=C0BMx2s04OE",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
    type: "movie",
    description: "An ex-hitman comes out of retirement to track down the gangsters who wronged him.",
    director: "Chad Stahelski",
    cast: ["Keanu Reeves"]
  },
  {
    title: "Mad Max: Fury Road",
    genre: "Action",
    year: 2015,
    rating: 8.1,
    image: "madmax.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=3VrgYEIHtUs",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
    type: "movie",
    description: "In a wasteland, a woman rebels against a tyrannical ruler in search for her homeland.",
    director: "George Miller",
    cast: ["Tom Hardy", "Charlize Theron"]
  },
  {
    title: "Mission Impossible",
    genre: "Action",
    year: 2018,
    rating: 7.8,
    image: "missionimpossible.jpg",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    type: "movie",
    description: "Ethan Hunt and his team must stop a terrorist attack.",
    director: "Christopher McQuarrie",
    cast: ["Tom Cruise"]
  },
  {
    title: "War",
    genre: "Action",
    year: 2019,
    rating: 7.1,
    image: "war.jpg",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    type: "movie",
    description: "A secret agent is tasked with hunting down a rogue spy.",
    director: "Siddharth Anand",
    cast: ["Hrithik Roshan", "Tiger Shroff"]
  },
  {
    title: "KGF Chapter 2",
    genre: "Action",
    year: 2022,
    rating: 8.2,
    image: "kgf.jpg",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    type: "movie",
    description: "The continuation of KGF, a powerful saga of greed, revenge, and justice.",
    director: "Prashanth Neel",
    cast: ["Yash"]
  },

  // ================= COMEDY MOVIES =================
  {
    title: "3 Idiots",
    genre: "Comedy",
    year: 2009,
    rating: 8.4,
    image: "3idiots.jpg",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
    type: "movie",
    description: "Three friends reunite after years to find out what happened to their companion.",
    director: "Rajkumar Hirani",
    cast: ["Aamir Khan", "Madhavan", "Mona Singh"]
  },
  {
    title: "The Hangover",
    genre: "Comedy",
    year: 2009,
    rating: 7.7,
    image: "hangover.jpg",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
    type: "movie",
    description: "Three friends wake up after a bachelor party with no memory of the previous night.",
    director: "Todd Phillips",
    cast: ["Bradley Cooper", "Ed Helms", "Zach Galifianakis"]
  },
  {
    title: "Jumanji",
    genre: "Comedy",
    year: 2017,
    rating: 7.0,
    image: "jumanji.jpg",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    type: "movie",
    description: "Four teenagers are sucked into a magical video game world.",
    director: "Jake Kasdan",
    cast: ["Dwayne Johnson", "Jack Black", "Kevin Hart"]
  },
  {
    title: "Gol Maal",
    genre: "Comedy",
    year: 2006,
    rating: 7.3,
    image: "golmaal.jpg",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    type: "movie",
    description: "A comedy about mistaken identities and misunderstandings.",
    director: "Rajpal Yadav",
    cast: ["Rajpal Yadav", "Sharman Joshi"]
  },
  {
    title: "Welcome",
    genre: "Comedy",
    year: 2007,
    rating: 7.1,
    image: "welcome.jpg",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    type: "movie",
    description: "A story of friendship and humor with unexpected twists.",
    director: "Anees Bazmi",
    cast: ["Akshay Kumar", "Katrina Kaif"]
  },
  {
    title: "Dhamaal",
    genre: "Comedy",
    year: 2006,
    rating: 7.2,
    image: "dhamaal.jpg",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
    type: "movie",
    description: "Four friends embark on a treasure hunt adventure filled with comedy.",
    director: "Rajpal Yadav",
    cast: ["Riteish Deshmukh", "Ajay Devgn"]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/moviemania");
    console.log("✅ Connected to MongoDB");

    // Clear existing movies
    await Movie.deleteMany({});
    console.log("🗑️  Cleared existing movies");

    // Insert sample movies
    const result = await Movie.insertMany(sampleMovies);
    console.log(`✅ Inserted ${result.length} movies into database`);

    console.log("\n📊 Sample Movies Added:");
    result.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.genre})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
