import { useMemo, useState } from "react";
import { useSeries } from "../hooks/useSeries";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieGrid from "../components/MovieGrid";
import SectionHeader from "../components/SectionHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";
import { resolveSeriesIndustry, sortCatalogItems } from "../utils/catalogUtils";

function Series() {
  const { seriesList, loading, error } = useSeries();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const normalizedCategory = String(category || "All").trim().toLowerCase();

  const seriesToRender = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const searchFilteredSeries = seriesList.filter((item) => {
      const title = String(item.title || "").toLowerCase();
      const genre = String(item.genre || "").toLowerCase();
      const description = String(item.description || "").toLowerCase();

      return (
        !searchTerm ||
        title.includes(searchTerm) ||
        genre.includes(searchTerm) ||
        description.includes(searchTerm)
      );
    });

    const categoryFilteredSeries =
      normalizedCategory === "all"
        ? searchFilteredSeries
        : searchFilteredSeries.filter((item) => resolveSeriesIndustry(item) === normalizedCategory);

    return sortCatalogItems(categoryFilteredSeries, sortBy);
  }, [seriesList, normalizedCategory, search, sortBy]);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <Navbar />

      <main className="pt-24 px-6 lg:px-12 flex-1 pb-16">
        <SectionHeader title="All Series" level={1} />

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
          <SearchBar
            placeholder="Search series..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-56 px-5 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-red-600 outline-none text-white"
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

        {/* Series Grid */}
        {loading ? (
          <LoadingSpinner message="Loading series..." />
        ) : error ? (
          <EmptyState message={error} error />
        ) : seriesToRender.length > 0 ? (
          <MovieGrid
            movies={seriesToRender}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8"
          />
        ) : (
          <EmptyState message="No series found matching your search or filters." />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Series;