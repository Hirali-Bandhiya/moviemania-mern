import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOffers } from "../hooks/useOffers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import OfferCard from "../components/OfferCard";
import { isLoggedIn, hasActivePlan } from "../utils/auth";

function Offers() {
  const { offers, loading, error } = useOffers();
  const [filter, setFilter] = useState("all"); // all, top, latest
  const navigate = useNavigate();

  // Timer state to force re-render every second for the countdown
  const [, setTick] = useState(0);

  useEffect(() => {
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
            <LoadingSpinner />
          ) : error ? (
            <EmptyState message={error} error />
          ) : filteredOffers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredOffers.map((offer) => (
                <OfferCard
                  key={offer._id}
                  offer={offer}
                  onClick={() => handleOfferClick(offer)}
                  getCountdown={getCountdown}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              message={
                <>
                  <p className="text-xl mb-4">No active offers available right now.</p>
                  <p className="text-base text-gray-400">Check back later for amazing deals!</p>
                </>
              }
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Offers;
