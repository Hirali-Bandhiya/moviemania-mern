import { useEffect, useState } from "react";
import { getMovies } from "../services/movieService";

import UnlimitedSeries from "../components/UnlimitedSeries";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieGrid from "../components/MovieGrid";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
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
    getMovies()
      .then(res => {
        const rawData = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.data) ? res.data.data : []);
        const apiMovies = rawData.filter((item) => String(item.type || "").toLowerCase() !== "series");

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

  return (
    <div className="bg-black text-white min-h-screen">

      <Navbar />

      <div className="pt-20">

        <Hero />

        {/* CONTINUE WATCHING */}
        {isLoggedIn && continueWatching.length > 0 && (
          <section className="px-8 lg:px-12 mt-16 pb-16">
            <SectionHeader title="Continue Watching" highlight="Watching" />
            <MovieGrid
              movies={continueWatching}
              className="flex gap-6 overflow-x-auto pb-4"
              onRemoveFromContinue={handleRemoveFromContinue}
            />
          </section>
        )}

        {/* RECENTLY WATCHED */}
        {recentlyWatched.length > 0 && (
          <section className="px-8 lg:px-12 mt-12 pb-16">
            <SectionHeader title="Recently Watched" highlight="Watched" />
            <MovieGrid
              movies={recentlyWatched}
              className="flex gap-6 overflow-x-auto pb-4"
            />
          </section>
        )}

        {/* SEARCH */}
        <div className="px-8 lg:px-12 mt-16">
          <SearchBar
            placeholder="Search movies..."
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
          <SectionHeader title="Movies" />

          <MovieGrid
            movies={filteredMovies}
            className="flex gap-6 overflow-x-auto pb-4"
          />

          {filteredMovies.length === 0 && (
            <EmptyState message="No movies found." className="mt-6 text-left" />
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