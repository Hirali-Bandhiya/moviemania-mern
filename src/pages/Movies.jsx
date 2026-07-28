import { useMemo, useState } from "react";
import { useMovies } from "../hooks/useMovies";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieGrid from "../components/MovieGrid";
import SectionHeader from "../components/SectionHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";

const BOLLYWOOD_TITLE_SET = new Set([
  "pathaan",
  "war",
  "kgf chapter 2",
  "3 idiots",
  "gol maal",
  "golmaal",
  "welcome",
  "dhamaal",
  "rrr",
  "mirzapur",
  "sacred games",
]);

const resolveMovieIndustry = (movie) => {
  const directIndustry = String(movie.industry || movie.category || "").trim().toLowerCase();

  if (directIndustry === "hollywood" || directIndustry === "bollywood") {
    return directIndustry;
  }

  const title = String(movie.title || "").trim().toLowerCase();
  if (BOLLYWOOD_TITLE_SET.has(title)) {
    return "bollywood";
  }

  return "hollywood";
};

const sortMovies = (movies, sortBy) => {
  const items = [...movies];

  if (sortBy === "rating-desc") {
    return items.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  }

  if (sortBy === "year-desc") {
    return items.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  }

  if (sortBy === "year-asc") {
    return items.sort((a, b) => Number(a.year || 0) - Number(b.year || 0));
  }

  return items;
};

function Movies() {
  const { movies: movieData, loading, error } = useMovies();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const normalizedCategory = String(category || "All").trim().toLowerCase();

  const moviesToRender = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const searchFilteredMovies = movieData.filter((movie) => {
      const title = String(movie.title || "").toLowerCase();
      const genre = String(movie.genre || "").toLowerCase();
      const description = String(movie.description || "").toLowerCase();

      return (
        !searchTerm ||
        title.includes(searchTerm) ||
        genre.includes(searchTerm) ||
        description.includes(searchTerm)
      );
    });

    const categoryFilteredMovies =
      normalizedCategory === "all"
        ? searchFilteredMovies
        : searchFilteredMovies.filter((movie) => resolveMovieIndustry(movie) === normalizedCategory);

    return sortMovies(categoryFilteredMovies, sortBy);
  }, [movieData, normalizedCategory, search, sortBy]);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="pt-24 px-6 lg:px-12 flex-1 pb-16">

        {/* Page Title */}
        <SectionHeader title="All Movies" level={1} />

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
          <SearchBar
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-56 px-5 py-3 rounded-xl bg-white/10 text-white border border-white/10 focus:ring-2 focus:ring-red-600 outline-none"
          >
            <option value="featured" className="bg-black">Featured</option>
            <option value="rating-desc" className="bg-black">Rating: High to Low</option>
            <option value="year-desc" className="bg-black">Year: Newest</option>
            <option value="year-asc" className="bg-black">Year: Oldest</option>
          </select>

          <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {["All", "Hollywood", "Bollywood"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-xl font-semibold transition whitespace-nowrap ${
                  category === cat
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content State */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState message={error} error />
        ) : (
          <MovieGrid
            movies={moviesToRender}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          />
        )}

        {!loading && !error && moviesToRender.length === 0 && (
          <EmptyState message="No movies found please try different search terms or filters." />
        )}

      </div>
      <Footer />
    </div>
  );
}

export default Movies;