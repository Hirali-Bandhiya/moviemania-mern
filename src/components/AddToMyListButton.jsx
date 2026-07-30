import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../constants/storageKeys";

function AddToMyListButton({ movie }) {
  const [isInList, setIsInList] = useState(false);
  const movieId = movie._id;

  useEffect(() => {
    const myList = JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_LIST) || "[]");
    setIsInList(myList.some((item) => item._id === movieId));
  }, [movieId]);

  const handleClick = () => {
    const myList = JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_LIST) || "[]");
    if (isInList) {
      const updated = myList.filter((item) => item._id !== movieId);
      localStorage.setItem(STORAGE_KEYS.MY_LIST, JSON.stringify(updated));
      setIsInList(false);
    } else {
      myList.push(movie);
      localStorage.setItem(STORAGE_KEYS.MY_LIST, JSON.stringify(myList));
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

export default AddToMyListButton;