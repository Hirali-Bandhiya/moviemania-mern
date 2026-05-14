import { useNavigate } from "react-router-dom";
import { Star, Plus, Check, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { getImageUrl } from "../utils/imageHelper";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist
} from "../utils/watchlist";
import {
  addToWishlistStore,
  removeFromWishlistStore,
  isInWishlistStore
} from "../features/wishlist/utils/wishlistHelper";

function MovieCard({ movie, requirePlanForAccess = false, onRemoveFromContinue = null }) {
  const navigate = useNavigate();

  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [inUserWishlist, setInUserWishlist] = useState(false);
  const [imageError, setImageError] = useState(false);

  const defaultImage = "https://via.placeholder.com/300x400?text=No+Image";
  const primaryImage = movie.image || movie.posterUrl;
  const imageUrl = imageError ? defaultImage : getImageUrl(primaryImage);
  const movieId = movie._id || movie.id;

  useEffect(() => {
    const watchlist = getWatchlist();

    setIsInWatchlist(
      watchlist.some((item) => (item._id || item.id) === movieId)
    );

    setInUserWishlist(isInWishlistStore(movieId));
  }, [movieId]);

  const handleMovieClick = () => {
    if (!movieId) {
      alert("Content not available");
      return;
    }

    navigate(`/movie/${movieId}`);
  };

  const handlePlay = (e) => {
    e.stopPropagation();

    if (!movieId) {
      alert("Content not available");
      return;
    }
    navigate(`/movie/${movieId}`);
  };

  // ✅ WATCHLIST
  const handleAddToList = (e) => {
    e.stopPropagation();

    if (isInWatchlist) {
      removeFromWatchlist(movieId);
      setIsInWatchlist(false);
    } else {
      addToWatchlist(movie);
      setIsInWatchlist(true);
    }
  };

  return (
    <div
      onClick={handleMovieClick}
      className="relative w-56 flex-shrink-0 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg">
        <img
          src={imageUrl}
          alt={movie.title}
          onError={() => setImageError(true)}
          className="h-80 w-full object-cover rounded-2xl transform group-hover:scale-110 transition duration-500"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

        {/* Play Button */}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
        >
          <Play size={48} className="text-white" />
        </button>

        {/* Watchlist */}
        <button
          onClick={handleAddToList}
          className={`absolute bottom-3 right-3 p-2 rounded-full ${
            isInWatchlist
              ? "bg-red-600 text-white"
              : "bg-white/20 text-white"
          }`}
        >
          {isInWatchlist ? <Check size={20} /> : <Plus size={20} />}
        </button>

        {/* Rating */}
        {movie.rating && (
          <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 rounded text-yellow-400 text-xs">
            ⭐ {movie.rating}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3">
        <h3 className="text-white font-semibold">
          {movie.title}
        </h3>

        <p className="text-gray-400 text-sm">
          {movie.genre} • {movie.year}
        </p>

        {/* Wishlist */}
        {!!localStorage.getItem("token") && (
          <button
            onClick={(e) => {
              e.stopPropagation();

              if (inUserWishlist) {
                removeFromWishlistStore(movieId);
                setInUserWishlist(false);
              } else {
                addToWishlistStore(movie);
                setInUserWishlist(true);
              }
            }}
            className="mt-2 w-full py-1 text-xs bg-gray-800 text-white rounded"
          >
            {inUserWishlist ? "In Wishlist ❤️" : "Add to Wishlist ❤️"}
          </button>
        )}

        {/* Remove from Continue Watching */}
        {onRemoveFromContinue && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromContinue();
            }}
            className="mt-2 w-full py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
