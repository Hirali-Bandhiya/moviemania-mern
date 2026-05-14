import { useState, useEffect } from "react";

function AddToMyListButton({ movie }) {
  const [isInList, setIsInList] = useState(false);
  const movieId = movie._id;

  useEffect(() => {
    const myList = JSON.parse(localStorage.getItem("myList") || "[]");
    setIsInList(myList.some((item) => item._id === movieId));
  }, [movieId]);

  const handleClick = () => {
    const myList = JSON.parse(localStorage.getItem("myList") || "[]");
    if (isInList) {
      const updated = myList.filter((item) => item._id !== movieId);
      localStorage.setItem("myList", JSON.stringify(updated));
      setIsInList(false);
    } else {
      myList.push(movie);
      localStorage.setItem("myList", JSON.stringify(myList));
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