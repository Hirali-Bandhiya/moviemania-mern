import { useState, useEffect } from "react";
import { getMovies } from "../services/movieService";
import { getSeries } from "../services/seriesService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieGrid from "../components/MovieGrid";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
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
          getMovies(),
          getSeries(),
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
          <SectionHeader
            title="Welcome to Dashboard"
            highlight="Dashboard"
            subtitle="Your personalized streaming experience"
            level={1}
            titleClassName="text-4xl font-black mb-2"
          />

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
                <SectionHeader title="Top Movies" level={3} />
                <MovieGrid movies={featuredMovies} className="flex flex-wrap gap-8" />
              </div>

              <div>
                <SectionHeader title="Top Series" level={3} />
                <MovieGrid movies={featuredSeries} className="flex flex-wrap gap-8" />
              </div>
            </div>
          </section>

          {/* Continue Watching */}
          <section className="mb-16">
            <SectionHeader title="Continue Watching" highlight="Watching" level={2} titleClassName="text-2xl font-bold mb-6" />
            {continueWatching.length === 0 ? (
              <MovieGrid movies={featuredMovies} className="flex flex-wrap gap-8 mb-8" />
            ) : (
              <MovieGrid movies={continueWatching} className="flex flex-wrap gap-8 mb-8" />
            )}
          </section>

          {/* My List */}
          <section className="mb-16">
            <SectionHeader title="My List" highlight="List" level={2} titleClassName="text-2xl font-bold mb-6" />
            {watchlist.length === 0 ? (
              <EmptyState message="Your watchlist is empty. Add movies to get started!" className="text-left mb-8" />
            ) : (
              <MovieGrid movies={watchlist} className="flex flex-wrap gap-8 mb-8" />
            )}
          </section>

          {/* Trending Movies */}
          <section className="mb-16">
            <SectionHeader title="Trending Now" highlight="Trending" level={2} titleClassName="text-2xl font-bold mb-6" />
            <MovieGrid movies={trendingMovies} className="flex flex-wrap gap-8 mb-8" />
          </section>

          {/* Recently Watched */}
          {recentlyWatched.length > 0 && (
            <section className="mb-16">
              <SectionHeader title="Recently Watched" highlight="Watched" level={2} titleClassName="text-2xl font-bold mb-6" />
              <MovieGrid movies={recentlyWatched} className="flex flex-wrap gap-8" />
            </section>
          )}

          {/* Recommended */}
          <section className="mb-16">
            <SectionHeader title="Recommended for You" highlight="You" level={2} titleClassName="text-2xl font-bold mb-6" />
            {recommendedMovies.length > 0 ? (
              <MovieGrid movies={recommendedMovies} className="flex flex-wrap gap-8" />
            ) : (
              <EmptyState message="Watch some movies to get personalised suggestions." className="text-left" />
            )}
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
