import { syncWishlistApi } from "../services/userService";
import { isLoggedIn } from "./auth";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { secureStorage } from "./secureStorage";

export const getWatchlist = () => {
  const currentUser = secureStorage.getItemJSON(STORAGE_KEYS.CURRENT_USER);
  if (currentUser && currentUser.wishlist) {
    return secureStorage.getItemJSON(STORAGE_KEYS.WATCHLIST, []);
  }
  return secureStorage.getItemJSON(STORAGE_KEYS.WATCHLIST, []);
};

export const syncWatchlistToBackend = async (movieId) => {
  if (!isLoggedIn()) return;
  try {
    await syncWishlistApi(movieId);
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
    secureStorage.setItemJSON(STORAGE_KEYS.WATCHLIST, list);
    syncWatchlistToBackend(movieId);
  }
};

export const removeFromWatchlist = (id) => {
  const list = getWatchlist().filter((movie) => (movie._id || movie.id) !== id);
  secureStorage.setItemJSON(STORAGE_KEYS.WATCHLIST, list);
  syncWatchlistToBackend(id);
};