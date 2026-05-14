import { useState, useEffect } from "react";
import { addToWatchlist, removeFromWatchlist, getWatchlist } from "../utils/watchlist";

function AddToListButton({ movie }) {
  const [isInList, setIsInList] = useState(false);

  const movieId = movie._id;

  useEffect(() => {
    const list = getWatchlist();
    setIsInList(list.some((item) => item._id === movieId));
  }, [movieId]);

  const handleClick = () => {
    if (isInList) {
      removeFromWatchlist(movieId);
      setIsInList(false);
    } else {
      addToWatchlist(movie);
      setIsInList(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-3 rounded-lg font-semibold transition ${
        isInList
          ? "bg-gray-600 hover:bg-gray-500 text-white"
          : "bg-red-600 hover:bg-red-700 text-white"
      }`}
    >
      {isInList ? "Remove from My List" : "Add to My List"}
    </button>
  );
}

export default AddToListButton;