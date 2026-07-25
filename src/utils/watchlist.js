import api from "../services/api";
import { isLoggedIn } from "./auth";
import { STORAGE_KEYS } from "../constants/storageKeys";

export const getWatchlist = () => {
  const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
  if (currentUser && currentUser.wishlist) {
    // Basic local sync tracking since we want UI fast
    let list = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    return list ? JSON.parse(list) : [];
  }
  const list = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
  return list ? JSON.parse(list) : [];
};

export const syncWatchlistToBackend = async (movieId) => {
  if (!isLoggedIn()) return;
  try {
    await api.put("/users/wishlist", { movieId });
  } catch(err) {
    console.warn("Could not sync watchlist to backend", err);
  }
};

export const addToWatchlist = (movie) => {
  const list = getWatchlist();
  const movieId = movie._id || movie.id;
  const exists = list.find((item) => (item._id || item.id) === movieId);
  if (!exists) {
    list.push(movie);
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
    syncWatchlistToBackend(movieId);
  }
};

export const removeFromWatchlist = (id) => {
  const list = getWatchlist().filter((movie) => (movie._id || movie.id) !== id);
  localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
  syncWatchlistToBackend(id);
};