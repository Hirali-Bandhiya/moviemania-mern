import { useEffect, useState } from "react";
import api from "../services/api";

import UnlimitedSeries from "../components/UnlimitedSeries";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieCard from "../components/MovieCard";
import PopularSection from "../components/PopularSection";
import Footer from "../components/Footer";
import localMoviesData from "../data/movies";

import { mapContinueMovies, removeContinueWatching } from "../utils/continueWatching";
import { mapRecentlyWatched } from "../utils/history";

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [continueWatching, setContinueWatching] = useState([]);
  const [recentlyWatched, setRecentlyWatched] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch movies from backend
  useEffect(() => {
    api.get("/movies")
      .then(res => {
        const apiMovies = Array.isArray(res.data)
          ? res.data.filter((item) => String(item.type || "").toLowerCase() !== "series")
          : [];

        if (apiMovies.length > 0) {
          setMovies(apiMovies);
        } else {
          const fallbackMovies = localMoviesData.filter(
            (item) => String(item.type || "").toLowerCase() !== "series"
          );
          setMovies(fallbackMovies);
        }
      })
      .catch(err => {
        console.warn("[API] Failed to fetch movies", err?.message || err);
        const fallbackMovies = localMoviesData.filter(
          (item) => String(item.type || "").toLowerCase() !== "series"
        );
        setMovies(fallbackMovies);
      });
  }, []);

  // ✅ Map continue & history
  useEffect(() => {
    setContinueWatching(mapContinueMovies(movies));
    setRecentlyWatched(mapRecentlyWatched(movies));
  }, [movies]);

  // ✅ Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Remove from continue watching
  const handleRemoveFromContinue = (movieId) => {
    removeContinueWatching(movieId);
    setContinueWatching(continueWatching.filter((movie) => (movie._id || movie.id) !== movieId));
  };

  // ✅ Filter movies
  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || movie.genre === category)
  );

  console.log(`📊 Filtering: ${movies.length} total movies → ${filteredMovies.length} filtered (search: "${search}", category: "${category}")`);

  return (
    <div className="bg-black text-white min-h-screen">

      <Navbar />

      <div className="pt-20">

        <Hero />

        {/* CONTINUE WATCHING */}
        {isLoggedIn && continueWatching.length > 0 && (
          <section className="px-8 lg:px-12 mt-16 pb-16">
            <h2 className="text-3xl font-bold mb-8">
              Continue <span className="text-red-600">Watching</span>
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {continueWatching.map((movie) => (
                <MovieCard 
                  key={movie._id} 
                  movie={movie} 
                  onRemoveFromContinue={() => handleRemoveFromContinue(movie._id || movie.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* RECENTLY WATCHED */}
        {recentlyWatched.length > 0 && (
          <section className="px-8 lg:px-12 mt-12 pb-16">
            <h2 className="text-3xl font-bold mb-8">
              Recently <span className="text-red-600">Watched</span>
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {recentlyWatched.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* SEARCH */}
        <div className="px-8 lg:px-12 mt-16">
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full md:w-1/3 px-5 py-3 rounded-xl bg-white/10 text-white border border-white/10 focus:ring-2 focus:ring-red-600 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div className="px-8 lg:px-12 mt-6 flex gap-4">
          {["All", "Action", "Comedy"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-xl font-semibold transition ${
                category === cat
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MOVIES */}
        <section className="px-8 lg:px-12 pb-24 mt-12">
          <h2 className="text-3xl font-bold mb-8">
            Movies
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {filteredMovies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <p className="mt-6 text-gray-400">
              No movies found.
            </p>
          )}
        </section>

        <UnlimitedSeries />
        <PopularSection />
        <Footer />

      </div>
    </div>
  );
}

export default Home;