import { useState, useEffect } from "react";
import movies from "../data/movies";
import MovieCard from "../components/MovieCard";
import { mapRecentlyWatched } from "../utils/history";

function WatchHistory() {
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    setWatchHistory(mapRecentlyWatched(movies));
  }, []);

  if (watchHistory.length === 0) return null;

  return (
    <section className="px-8 lg:px-12 mt-16 pb-16">
      <h2 className="text-3xl font-bold mb-8">
        Watch <span className="text-red-600">History</span>
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {watchHistory.map((movie) => (
          <MovieCard key={movie._id || movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default WatchHistory;