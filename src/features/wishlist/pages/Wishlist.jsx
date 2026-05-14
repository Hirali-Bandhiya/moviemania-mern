import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { getWishlist, removeFromWishlistStore } from "../utils/wishlistHelper";
import WishlistCard from "../components/WishlistCard";
import { HeartCrack } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const handleRemoveItem = (id) => {
    setWishlist((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 lg:px-12 py-10">
        <div className="flex items-center gap-3 mb-10">
          <h2 className="text-4xl font-black tracking-widest text-[#E50914] uppercase drop-shadow-lg">
            My Wishlist
          </h2>
          <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {wishlist.length} Items
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <HeartCrack size={80} className="mb-6 opacity-20" />
            <p className="text-2xl font-bold tracking-wide">No items in wishlist</p>
            <p className="mt-2 text-gray-500">Discover movies and series you'd love to watch later.</p>
            <button
              onClick={() => navigate("/movies")}
              className="mt-8 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/20"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {wishlist.map((item) => (
              <WishlistCard
                key={item._id}
                movie={item}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Wishlist;
