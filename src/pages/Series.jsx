import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";

const BOLLYWOOD_TITLE_SET = new Set([
  "mirzapur",
  "sacred games",
  "the family man",
  "panchayat",
  "asur",
  "farzi",
  "scam 1992",
  "kota factory",
  "delhi crime",
]);

const BOLLYWOOD_IMAGE_HINT_SET = new Set([
  "mirzapur",
  "sacredgames",
  "golmaal",
  "welcome",
  "dhamaal",
  "3idiots",
  "idiots",
  "pathaan",
  "war",
  "kgf",
  "rrr",
]);

const resolveSeriesIndustry = (item) => {
  const title = String(item.title || "").trim().toLowerCase();
  const directCategory = String(item.category || "").trim().toLowerCase();
  const directIndustry = String(item.industry || "").trim().toLowerCase();
  const imageName = String(item.image || "")
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "");

  if (directCategory === "bollywood" || directIndustry === "bollywood") {
    return "bollywood";
  }

  if (BOLLYWOOD_TITLE_SET.has(title)) {
    return "bollywood";
  }

  if (BOLLYWOOD_IMAGE_HINT_SET.has(imageName)) {
    return "bollywood";
  }

  return "hollywood";
};

const sortSeries = (series, sortBy) => {
  const items = [...series];

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

function Series() {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const { data } = await api.get("/series");
        setSeriesList(Array.isArray(data) ? data : []);
        setError("");
      } catch (error) {
        console.error("[API] Failed to load series", error);
        setSeriesList([]);
        setError("Failed to load series. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

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

    return sortSeries(categoryFilteredSeries, sortBy);
  }, [seriesList, normalizedCategory, search, sortBy]);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <Navbar />

      <main className="pt-24 px-6 lg:px-12 flex-1 pb-16">
        <h1 className="text-4xl font-bold mb-10 mt-4">All Series</h1>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
          <input
            type="text"
            placeholder="Search series..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-5 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-red-600 outline-none"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-56 px-5 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-red-600 outline-none"
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
          <div className="text-center py-20 text-gray-400">Loading series...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : seriesToRender.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {seriesToRender.map(series => (
              <MovieCard key={series._id || series.id} movie={series} requirePlanForAccess={series.requirePlanForAccess} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            No series found matching your search or filters.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Series;