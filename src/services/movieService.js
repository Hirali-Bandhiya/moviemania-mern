import api from "./api";
import { API_ENDPOINTS } from "../config/api.config";
import { extractErrorMessage } from "./apiError";

export const getMovies = async () => {
  try {
    return await api.get(API_ENDPOINTS.MOVIES.BASE);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch movies"));
  }
};

export const getMovieById = async (id) => {
  try {
    return await api.get(`${API_ENDPOINTS.MOVIES.BASE}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch movie details"));
  }
};

export const createMovie = async (payload) => {
  try {
    return await api.post(API_ENDPOINTS.MOVIES.BASE, payload);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create movie"));
  }
};

export const updateMovie = async (id, payload) => {
  try {
    return await api.put(`${API_ENDPOINTS.MOVIES.BASE}/${id}`, payload);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update movie"));
  }
};

export const deleteMovie = async (id) => {
  try {
    return await api.delete(`${API_ENDPOINTS.MOVIES.BASE}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete movie"));
  }
};

