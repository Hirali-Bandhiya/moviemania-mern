import { useState, useEffect } from "react";
import movies from "../data/movies";
import MovieCard from "./MovieCard";
import { removeContinueWatching } from "../utils/continueWatching";

function ContinueWatching() {
  const [continueWatching, setContinueWatching] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("continueWatching") || "[]");
    const mapped = stored.map((item) => {
      const movie = movies.find((m) => m._id === item.movieId || m.id === item.movieId);
      return movie ? { ...movie, progress: item.progress } : null;
    }).filter(Boolean);
    setContinueWatching(mapped);
  }, []);

  const handleRemove = (movieId) => {
    removeContinueWatching(movieId);
    setContinueWatching(continueWatching.filter((movie) => (movie._id || movie.id) !== movieId));
  };

  if (!isLoggedIn || continueWatching.length === 0) return null;

  return (
    <section className="px-8 lg:px-12 mt-16 pb-16">
      <h2 className="text-3xl font-bold mb-8">
        Continue <span className="text-red-600">Watching</span>
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {continueWatching.map((movie) => (
          <MovieCard 
            key={movie._id || movie.id} 
            movie={movie} 
            onRemoveFromContinue={() => handleRemove(movie._id || movie.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default ContinueWatching;