import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { isLoggedIn, hasActivePlan } from "../utils/auth";
import { getImageUrl } from "../utils/imageHelper";

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, top, latest
  const navigate = useNavigate();

  // Timer state to force re-render every second for the countdown
  const [, setTick] = useState(0);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await api.get("/offers");
        setOffers(Array.isArray(data) ? data : []);
        setError("");
      } catch (error) {
        console.error("Failed to fetch offers", error);
        setOffers([]);
        setError("Failed to load offers. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();

    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(offers);
  }, [offers]);

  const handleOfferClick = (offer) => {
    if (!isLoggedIn()) {
      navigate("/register");
    } else if (!hasActivePlan()) {
      navigate("/plans");
    } else {
      if (offer.movieId?._id) {
        navigate(`/movie/${offer.movieId._id}`);
      }
    }
  };

  const getCountdown = (validTill) => {
    const now = new Date();
    const expiry = new Date(validTill);
    const diff = expiry - now;

    if (diff <= 0) return "EXPIRED";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m ${seconds}s left`;
  };

  const filteredOffers = [...offers]
    .filter((offer) => offer?.isActive !== false && (!offer.validTill || new Date(offer.validTill) > new Date()))
    .sort((a, b) => {
      if (filter === "top") {
        const bSavings = ((b.movieId?.price || 99) - b.finalPrice) / (b.movieId?.price || 99);
        const aSavings = ((a.movieId?.price || 99) - a.finalPrice) / (a.movieId?.price || 99);
        return bSavings - aSavings;
      }
      if (filter === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
      return (b.discountValue || 0) - (a.discountValue || 0);
    });

  return (
    <div className="bg-[#0f172a] min-h-screen text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 px-8 pb-16 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-red-600/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-black mb-2 text-center drop-shadow-sm">Exclusive Offers</h1>
          <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            Grab these limited-time deals on your favorite movies. Subscribe to unlock the best entertainment at unbeatable prices.
          </p>

          {/* Filters */}
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${filter === "all" ? "bg-red-600 text-white" : "bg-white/10 text-gray-400 hover:bg-white/20"}`}
            >
              All Offers
            </button>
            <button
              onClick={() => setFilter("top")}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${filter === "top" ? "bg-red-600 text-white" : "bg-white/10 text-gray-400 hover:bg-white/20"}`}
            >
              Top Offers
            </button>
            <button
              onClick={() => setFilter("latest")}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${filter === "latest" ? "bg-red-600 text-white" : "bg-white/10 text-gray-400 hover:bg-white/20"}`}
            >
              Latest Offer
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-400">
              <p className="text-xl mb-4">{error}</p>
            </div>
          ) : filteredOffers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredOffers.map((offer) => {
                const isExpired = new Date(offer.validTill) < new Date();
                const movie = offer.movieId;
                
                if (!movie) return null;

                const primaryImage = movie.image || movie.posterUrl;
                const countdown = getCountdown(offer.validTill);

                return (
                  <div
                    key={offer._id}
                    onClick={() => handleOfferClick(offer)}
                    className="relative flex-shrink-0 cursor-pointer group bg-[#1e293b]/50 rounded-2xl shadow-lg border border-white/5 overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-red-500/20"
                  >
                    <div className="absolute top-4 -right-8 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold px-10 py-1 rotate-45 shadow-lg z-20 pointer-events-none">
                      {offer.discountType === "percentage" ? `${offer.discountValue}% OFF` : `$${offer.discountValue} OFF`}
                    </div>

                    <div className="relative overflow-hidden h-72">
                      <img
                        src={getImageUrl(primaryImage)}
                        alt={movie.title}
                        className={`w-full h-full object-cover transform transition duration-500 ${isExpired ? "grayscale" : "group-hover:scale-110"}`}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90"></div>
                      
                      {isExpired ? (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                          <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg transform -rotate-12">
                            EXPIRED
                          </span>
                        </div>
                      ) : (
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-yellow-400 text-[10px] font-bold px-2 py-1 rounded shadow z-10 flex items-center gap-1">
                          ⏳ {countdown}
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-grow flex flex-col justify-between z-10 bg-gradient-to-b from-[#0f172a] to-[#1e293b]/50 -mt-10 pt-4 rounded-t-3xl border-t border-white/5">
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate drop-shadow-md">
                          {offer.title}
                        </h3>
                        <p className="text-gray-400 text-xs truncate mb-2">
                          {movie.title} • {movie.genre}
                        </p>
                      </div>

                      <div className="mt-2 flex items-end justify-between border-t border-white/10 pt-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 line-through">
                            ${movie.price || 99}
                          </span>
                          <span className="text-xl font-black text-red-500 drop-shadow-md">
                            ${offer.finalPrice?.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-white bg-white/10 px-2 py-1 rounded border border-white/5">
                            {new Date(offer.validTill).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-xl mb-4">No active offers available right now.</p>
              <p>Check back later for amazing deals!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Offers;
