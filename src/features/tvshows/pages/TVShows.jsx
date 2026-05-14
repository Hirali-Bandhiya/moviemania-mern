import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MovieCard from "../../../components/MovieCard";
import { tvShowData } from "../data/tvshowData";

function TVShowsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredShows = tvShowData.filter(item => {
    const titleMatch = (item.title || "").toLowerCase().includes(search.toLowerCase());
    const categoryMatch = category === "All" || item.genre === category;
    return titleMatch && categoryMatch;
  });

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <Navbar />
      <div className="pt-24 px-6 lg:px-12 flex-1 pb-16">
        <h1 className="text-4xl font-bold mb-10 mt-4">TV Shows</h1>
        
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
          <input
            type="text"
            placeholder="Search TV shows..."
            className="w-full md:w-1/3 px-5 py-3 rounded-xl bg-white/10 text-white border border-white/10 focus:ring-2 focus:ring-red-600 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {["All", "Sci-Fi", "Thriller", "Drama"].map((cat) => (
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredShows.map(show => (
            <MovieCard key={show._id || show.id} movie={show} />
          ))}
        </div>
        
        {filteredShows.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-lg">
            No TV shows found matching your search.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
export default TVShowsPage;
