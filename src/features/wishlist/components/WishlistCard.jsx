import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { getImageUrl } from "../../../utils/imageHelper";
import { removeFromWishlistStore } from "../utils/wishlistHelper";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, hasPayment } from "../../../utils/auth";

function WishlistCard({ movie, onRemove }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const defaultImage = "https://via.placeholder.com/300x400?text=No+Image";
  const primaryImage = movie.image || movie.posterUrl;
  const imageUrl = imageError ? defaultImage : getImageUrl(primaryImage);

  const movieId = movie._id || movie.id;

  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromWishlistStore(movieId);
    if (onRemove) onRemove(movieId);
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    console.log("Movie Clicked:", movie);
    if (!movieId) {
      alert("Content not available");
      return;
    }
    if (movie.videoUrl === undefined || movie.videoUrl === null) {
      alert("Content coming soon");
      return;
    }
    if (isLoggedIn() && !hasPayment()) {
      navigate("/plans");
    } else {
      navigate(`/watch/${movieId}`);
    }
  };

  const handleCardClick = () => {
    console.log("Movie Clicked:", movie);
    if (!movieId) {
      alert("Content not available");
      return;
    }
    navigate(`/movie/${movieId}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="relative w-full max-w-[220px] flex-shrink-0 cursor-pointer group bg-gray-900 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-xl shadow-black/40 border border-white/5"
    >
      <div className="relative h-72 w-full">
        <img
          src={imageUrl}
          alt={movie.title}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-60"
        />
        
        <button
          onClick={handlePlay}
          className="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 hover:scale-110"
        >
          <Play size={24} className="text-white ml-1" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold truncate group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-sm mt-1">{movie.year} • {movie.genre}</p>
        
        <button
          onClick={handleRemove}
          className="mt-4 w-full py-2 bg-white/10 hover:bg-red-600 hover:text-white text-gray-300 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2"
        >
          Remove 💔
        </button>
      </div>
    </div>
  );
}

export default WishlistCard;
