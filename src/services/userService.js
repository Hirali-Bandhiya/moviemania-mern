import api from "./api";
import { API_ENDPOINTS } from "../config/api.config";
import { extractErrorMessage } from "./apiError";

export const getUsers = async () => {
  try {
    return await api.get(API_ENDPOINTS.USERS.BASE);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch users"));
  }
};

export const getCurrentUserApi = async () => {
  try {
    return await api.get(API_ENDPOINTS.USERS.ME);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch current user profile"));
  }
};

export const updateUser = async (id, payload) => {
  try {
    return await api.put(`${API_ENDPOINTS.USERS.BASE}/${id}`, payload);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update user"));
  }
};

export const deleteUser = async (id) => {
  try {
    return await api.delete(`${API_ENDPOINTS.USERS.BASE}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete user"));
  }
};

export const syncWishlistApi = async (movieId) => {
  try {
    return await api.put(API_ENDPOINTS.USERS.WISHLIST, { movieId });
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to sync wishlist"));
  }
};

export const updateProfileApi = async (payload) => {
  try {
    const { data } = await api.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, payload);
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to update profile"));
  }
};

