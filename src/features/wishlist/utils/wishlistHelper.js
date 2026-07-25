import api from "../../../services/api";
import { isLoggedIn } from "../../../utils/auth";
import { STORAGE_KEYS } from "../../../constants/storageKeys";

export const getWishlist = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
};

const syncWishlistToBackend = async (movieId) => {
  if (!isLoggedIn()) return;

  try {
    await api.put("/users/wishlist", { movieId });
  } catch (error) {
    console.warn("Wishlist sync failed", error);
  }
};

export const addToWishlistStore = (item) => {
  const current = getWishlist();
  if (!current.find((i) => i._id === item._id)) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([...current, item]));
    syncWishlistToBackend(item._id);
  }
};

export const removeFromWishlistStore = (id) => {
  const current = getWishlist();
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(current.filter((i) => i._id !== id)));
  syncWishlistToBackend(id);
};

export const isInWishlistStore = (id) => {
  return getWishlist().some((i) => i._id === id);
};
