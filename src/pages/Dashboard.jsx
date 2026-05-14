import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import movies from "../data/movies";
import { mapContinueMovies } from "../utils/continueWatching";
import { getWatchlist } from "../utils/watchlist";
import { mapRecentlyWatched } from "../utils/history";

function Dashboard() {
  const [continueWatching, setContinueWatching] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [recentlyWatched, setRecentlyWatched] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    setContinueWatching(mapContinueMovies(movies));
    setWatchlist(getWatchlist());
    setRecentlyWatched(mapRecentlyWatched(movies));
  }, []);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [moviesResponse, seriesResponse] = await Promise.all([
          api.get("/movies"),
          api.get("/series"),
        ]);

        const movieItems = Array.isArray(moviesResponse.data) ? moviesResponse.data : [];
        const seriesItems = Array.isArray(seriesResponse.data) ? seriesResponse.data : [];

        setCatalog([...movieItems, ...seriesItems]);
      } catch (error) {
        console.error("Failed to load dashboard catalog", error);
        setCatalog(movies);
      } finally {
        setCatalogLoading(false);
      }
    };

    loadCatalog();
  }, []);

  // update recommendations when recentlyWatched changes
  useEffect(() => {
    const genres = [...new Set(recentlyWatched.map((m) => m.genre))];
    const recs = movies.filter(
      (m) => genres.includes(m.genre) &&
             !recentlyWatched.some((rw) => rw.id === m.id)
    );
    setRecommendedMovies(recs.slice(0, 12));
  }, [recentlyWatched]);

  const trendingMovies = catalog.length > 0
    ? catalog.filter((m) => m.trending).slice(0, 8)
    : movies.filter((m) => m.trending).slice(0, 8);

  const featuredMovies = catalog.length > 0
    ? catalog.filter((m) => String(m.type || "").toLowerCase() !== "series").slice(0, 6)
    : movies.filter((m) => String(m.type || "").toLowerCase() !== "series").slice(0, 6);

  const featuredSeries = catalog.length > 0
    ? catalog.filter((m) => String(m.type || "").toLowerCase() === "series").slice(0, 6)
    : movies.filter((m) => String(m.type || "").toLowerCase() === "series").slice(0, 6);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="pt-32 pb-16 px-6 lg:px-12 flex-grow">
        <div className="max-w-[1440px] mx-auto">
          
          {/* Header */}
          <h1 className="text-4xl font-black mb-2">
            Welcome to <span className="text-red-600">Dashboard</span>
          </h1>
          <p className="text-gray-400 mb-12">
            Your personalized streaming experience
          </p>

          {/* Featured Movies & Series */}
          <section className="mb-16">
            <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
              <h2 className="text-2xl font-bold">
                Featured <span className="text-red-600">Movies</span> & <span className="text-red-600">Series</span>
              </h2>
              <span className="text-sm text-gray-500">
                {catalogLoading ? "Loading catalog..." : `${featuredMovies.length + featuredSeries.length} picks`}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Top Movies</h3>
                <div className="flex flex-wrap gap-8">
                  {featuredMovies.map((movie) => (
                    <MovieCard key={movie._id || movie.id} movie={movie} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Top Series</h3>
                <div className="flex flex-wrap gap-8">
                  {featuredSeries.map((series) => (
                    <MovieCard key={series._id || series.id} movie={series} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Continue Watching */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">
              Continue <span className="text-red-600">Watching</span>
            </h2>
            {continueWatching.length === 0 ? (
              <div>
                <div className="flex flex-wrap gap-8 mb-8">
                  {featuredMovies.map((movie) => (
                    <MovieCard key={movie._id || movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-8 mb-8">
                {continueWatching.map((movie) => (
                  <MovieCard key={movie._id || movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>

          {/* My List */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">
              My <span className="text-red-600">List</span>
            </h2>
            {watchlist.length === 0 ? (
              <p className="text-gray-400 mb-8">
                Your watchlist is empty. Add movies to get started!
              </p>
            ) : (
              <div className="flex flex-wrap gap-8 mb-8">
                {watchlist.map((movie) => (
                  <MovieCard key={movie._id || movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>

          {/* Trending Movies */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">
              <span className="text-red-600">Trending</span> Now
            </h2>
            <div className="flex flex-wrap gap-8 mb-8">
              {trendingMovies.map((movie) => (
                <MovieCard key={movie._id || movie.id} movie={movie} />
              ))}
            </div>
          </section>

          {/* Recently Watched */}
          {recentlyWatched.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">
                Recently <span className="text-red-600">Watched</span>
              </h2>
              <div className="flex flex-wrap gap-8">
                {recentlyWatched.map((movie) => (
                  <MovieCard key={movie._id || movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {/* Recommended */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">
              Recommended for <span className="text-red-600">You</span>
            </h2>
            {recommendedMovies.length > 0 ? (
              <div className="flex flex-wrap gap-8">
                {recommendedMovies.map((movie) => (
                  <MovieCard key={movie._id || movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                Watch some movies to get personalised suggestions.
              </p>
            )}
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
