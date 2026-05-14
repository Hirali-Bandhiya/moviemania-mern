// src/data/movies.js

// ---------- MOVIE IMAGES ----------
import interstellar from "../assets/images/interstellar.jpg";
import darkknight from "../assets/images/darkknight.jpg";
import rrr from "../assets/images/rrr.jpg";
import idiots from "../assets/images/3idiots.jpg";
import inception from "../assets/images/inception.jpg";
import avengers from "../assets/images/avengers.jpg";
import pathaan from "../assets/images/pathaan.jpg";

// --- NEW ACTION MOVIES ---
import johnwick from "../assets/images/johnwick.jpg";
import madmax from "../assets/images/madmax.jpg";
import missionimpossible from "../assets/images/missionimpossible.jpg";
import war from "../assets/images/war.jpg";
import kgf from "../assets/images/kgf.jpg";

// --- NEW COMEDY MOVIES ---
import hangover from "../assets/images/hangover.jpg";
import jumanji from "../assets/images/jumanji.jpg";
import golmaal from "../assets/images/golmaal.jpg";
import welcome from "../assets/images/welcome.jpg";
import dhamaal from "../assets/images/dhamaal.jpg";

// ---------- SERIES IMAGES ----------
import strangerthings from "../assets/images/strangerthings.jpg";
import moneyheist from "../assets/images/moneyheist.jpg";
import theboys from "../assets/images/theboys.jpg";
import narcos from "../assets/images/narcos.jpg";
import darkseries from "../assets/images/dark.jpg";
import peakyblinders from "../assets/images/peakyblinders.jpg";
import sacredgames from "../assets/images/sacredgames.jpg";
import mirzapur from "../assets/images/mirzapur.jpg";

const movies = [

  // ================= ACTION MOVIES =================
  {
    id: 1,
    type: "movie",
    title: "The Dark Knight",
    genre: "Action",
    year: 2008,
    rating: 9.0,
    image: darkknight,
    trailer: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    duration: 9120, // seconds (2h32m)
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
  },
  {
    id: 2,
    type: "movie",
    title: "Avengers",
    genre: "Action",
    year: 2019,
    rating: 8.4,
    trending: true,
    category: "Hollywood",
    image: avengers,
    trailer: "https://www.youtube.com/watch?v=hA6hldpSTF8",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    description: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    director: "Joss Whedon",
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"]
  },
  {
    id: 3,
    type: "movie",
    title: "Pathaan",
    genre: "Action",
    year: 2023,
    rating: 7.5,
    image: pathaan,
    trailer: "https://www.youtube.com/watch?v=p1j5fJn5Bg4",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },
  {
    id: 4,
    type: "movie",
    title: "John Wick",
    genre: "Action",
    year: 2014,
    rating: 8.0,
    image: johnwick,
    trailer: "https://www.youtube.com/watch?v=C0BMx2s04OE",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
  },
  {
    id: 5,
    type: "movie",
    title: "Mad Max: Fury Road",
    genre: "Action",
    year: 2015,
    rating: 8.1,
    image: madmax,
    trailer: "https://www.youtube.com/watch?v=3VrgYEIHtUs",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
  },
  {
    id: 6,
    type: "movie",
    title: "Mission Impossible",
    genre: "Action",
    year: 2018,
    rating: 7.8,
    image: missionimpossible,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  },
  {
    id: 7,
    type: "movie",
    title: "War",
    genre: "Action",
    year: 2019,
    rating: 7.1,
    image: war,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  },
  {
    id: 8,
    type: "movie",
    title: "KGF Chapter 2",
    genre: "Action",
    year: 2022,
    rating: 8.2,
    image: kgf,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },

  // ================= COMEDY MOVIES =================
  {
    id: 20,
    type: "movie",
    title: "3 Idiots",
    genre: "Comedy",
    year: 2009,
    rating: 8.4,
    image: idiots,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
  },
  {
    id: 21,
    type: "movie",
    title: "The Hangover",
    genre: "Comedy",
    year: 2009,
    rating: 7.7,
    image: hangover,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
  },
  {
    id: 22,
    type: "movie",
    title: "Jumanji",
    genre: "Comedy",
    year: 2017,
    rating: 6.9,
    image: jumanji,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  },
  {
    id: 23,
    type: "movie",
    title: "Golmaal",
    genre: "Comedy",
    year: 2006,
    rating: 7.4,
    image: golmaal,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  },
  {
    id: 24,
    type: "movie",
    title: "Welcome",
    genre: "Comedy",
    year: 2007,
    rating: 7.0,
    image: welcome,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },
  {
    id: 25,
    type: "movie",
    title: "Dhamaal",
    genre: "Comedy",
    year: 2007,
    rating: 7.3,
    trending: true,
    category: "Bollywood",
    image: dhamaal,
    trailer: "https://www.youtube.com/watch?v=FKHcAPBNnkI",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
  },

  // ================= SCI-FI MOVIES =================
  {
    id: 40,
    type: "movie",
    title: "Interstellar",
    genre: "Sci-Fi",
    year: 2014,
    rating: 8.6,
    trending: true,
    category: "Hollywood",
    image: interstellar,
    trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
    duration: 10140 // seconds (2h49m)
  },
  {
    id: 41,
    type: "movie",
    title: "Inception",
    genre: "Sci-Fi",
    year: 2010,
    rating: 8.8,
    image: inception,
    trailer: "https://www.youtube.com/watch?v=YoHD_XwrzKc",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  },

  // ================= SERIES =================
  {
    id: 100,
    type: "series",
    title: "Stranger Things",
    genre: "Sci-Fi",
    year: 2016,
    rating: 8.8,
    trending: true,
    category: "Hollywood",
    image: strangerthings,
    trailer: "https://www.youtube.com/watch?v=b9ncwOtgF8w",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  },
  {
    id: 101,
    type: "series",
    title: "Money Heist",
    genre: "Thriller",
    year: 2017,
    rating: 8.3,
    trending: true,
    category: "Hollywood",
    image: moneyheist,
    trailer: "https://www.youtube.com/watch?v=lX_RUhb5fYE",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },
  {
    id: 102,
    type: "series",
    title: "The Boys",
    genre: "Action",
    year: 2019,
    rating: 8.7,
    image: theboys,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
  },
  {
    id: 103,
    type: "series",
    title: "Narcos",
    genre: "Drama",
    year: 2015,
    rating: 8.8,
    trending: true,
    category: "Bollywood",
    image: narcos,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
  },
  {
    id: 104,
    type: "series",
    title: "Dark",
    genre: "Sci-Fi",
    year: 2017,
    rating: 8.8,
    image: darkseries,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  },
  {
    id: 105,
    type: "series",
    title: "Peaky Blinders",
    genre: "Drama",
    year: 2013,
    rating: 8.8,
    image: peakyblinders,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    
  },
  {
    id: 106,
    type: "series",
    title: "Sacred Games",
    genre: "Thriller",
    year: 2018,
    rating: 8.6,
    image: sacredgames,
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },
  {
    id: 107,
    type: "series",
    title: "Mirzapur",
    genre: "Drama",
    year: 2018,
    rating: 8.4,
    trending: true,
    image: mirzapur,
    category: "Bollywood",
    trailer: "https://www.youtube.com/watch?v=OBSGBQJllhg",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
  },
];

// Ensure each movie has an _id field (needed for routing / watch pages)
export default movies.map((movie) => ({
  ...movie,
  _id: movie._id || movie.id,
  videoUrl: movie.videoUrl || "",
  description: movie.description || "A thrilling sci-fi series about supernatural events in a small town.",
}));
