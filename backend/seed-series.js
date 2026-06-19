const mongoose = require("mongoose");
const Series = require("./models/Series");
require("dotenv").config();

const seriesData = [
  {
    title: "Stranger Things",
    genre: "Sci-Fi",
    year: 2015,
    rating: 8.8,
    image: "strangerthings.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=b9ncwOtgF8w",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    type: "series",
    description: "A group of kids uncover supernatural secrets in a small town.",
    director: "The Duffer's Brothers",
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"],
  },
  {
    title: "Money Heist",
    genre: "Thriller",
    year: 2017,
    rating: 8.3,
    image: "moneyheist.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=lX_RUhb5fYE",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    type: "series",
    description: "A criminal mastermind plans the biggest heist in history.",
    director: "Alex Pina",
    cast: ["Alvaro Morte", "Ursula Corbero", "Itziar Ituno"],
  },
  {
    title: "The Boys",
    genre: "Action",
    year: 2019,
    rating: 8.7,
    image: "theboys.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=M1bhOaLV4FU",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
    type: "series",
    description: "A vigilante team sets out to take down corrupt superheroes.",
    director: "Eric Kripke",
    cast: ["Karl Urban", "Jack Quaid", "Antony Starr"],
  },
  {
    title: "Narcos",
    genre: "Drama",
    year: 2015,
    rating: 8.8,
    image: "narcos.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=U7elNhHwgBU",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
    type: "series",
    description: "The rise and fall of cocaine kingpins in Colombia.",
    director: "Jose Padilha",
    cast: ["Wagner Moura", "Pedro Pascal", "Boyd Holbrook"],
  },
  {
    title: "Dark",
    genre: "Sci-Fi",
    year: 2017,
    rating: 8.8,
    image: "dark.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=rrwycJ08PSA",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    type: "series",
    description: "A time-travel mystery spanning generations in a German town.",
    director: "Baran bo Odar",
    cast: ["Louis Hofmann", "Karoline Eichhorn", "Lisa Vicari"],
  },
  {
    title: "Peaky Blinders",
    genre: "Drama",
    year: 2013,
    rating: 8.8,
    image: "peakyblinders.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=oVzVdvGIC7U",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    type: "series",
    description: "A gangster family rises to power in post-war Birmingham.",
    director: "Steven Knight",
    cast: ["Cillian Murphy", "Paul Anderson", "Helen McCrory"],
  },
  {
    title: "Sacred Games",
    genre: "Thriller",
    year: 2018,
    rating: 8.6,
    image: "sacredgames.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=AuwGYVN_tOI",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    type: "series",
    description: "A cop and a gangster become linked in a deadly race against time.",
    director: "Anurag Kashyap",
    cast: ["Saif Ali Khan", "Nawazuddin Siddiqui", "Radhika Apte"],
  },
  {
    title: "Mirzapur",
    genre: "Drama",
    year: 2018,
    rating: 8.4,
    image: "mirzapur.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=ZNeGF-PvRHY",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
    type: "series",
    description: "Power, crime, and ambition collide in a lawless city.",
    director: "Karan Anshuman",
    cast: ["Pankaj Tripathi", "Ali Fazal", "Divyenndu"],
  },
  {
    title: "Brooklyn Nine-Nine",
    genre: "Comedy",
    year: 2013,
    rating: 8.4,
    image: "hangover.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=sEOuJ4z5aTc",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
    type: "series",
    description: "A comedy series following detectives in a New York precinct.",
    director: "Dan Goor",
    cast: ["Andy Samberg", "Andre Braugher", "Terry Crews"],
  },
  {
    title: "Friends",
    genre: "Comedy",
    year: 1994,
    rating: 8.9,
    image: "jumanji.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=hDNNmeeJs1Q",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    type: "series",
    description: "Six friends navigate life, work, and relationships in New York City.",
    director: "David Crane",
    cast: ["Jennifer Aniston", "Courteney Cox", "Matthew Perry"],
  },
  {
    title: "The Office",
    genre: "Comedy",
    year: 2005,
    rating: 9.0,
    image: "welcome.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=LHOtME2DL4g",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    type: "series",
    description: "A mockumentary on a group of typical office workers at Dunder Mifflin.",
    director: "Greg Daniels",
    cast: ["Steve Carell", "Rainn Wilson", "John Krasinski"],
  },
  {
    title: "Modern Family",
    genre: "Comedy",
    year: 2009,
    rating: 8.5,
    image: "golmaal.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Ub_lfN2Vn6Q",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    type: "series",
    description: "Three interconnected families share hilarious moments through modern life.",
    director: "Christopher Lloyd",
    cast: ["Ed O'Neill", "Sofia Vergara", "Ty Burrell"],
  },
];

const seedSeries = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existingSeriesCount = await Series.countDocuments();

    if (existingSeriesCount > 0) {
      await Series.deleteMany({});
      console.log(`Removed ${existingSeriesCount} existing series documents`);
    }

    const inserted = await Series.insertMany(seriesData);
    console.log(`Inserted ${inserted.length} series records`);

    await mongoose.connection.close();
    console.log("Series seed complete");
  } catch (error) {
    console.error("Series seed failed:", error.message || error);
    process.exit(1);
  }
};

seedSeries();
