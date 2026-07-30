import api from "./api";
import { API_ENDPOINTS } from "../config/api.config";
import { extractErrorMessage } from "./apiError";

export const getSeries = async () => {
  try {
    return await api.get(API_ENDPOINTS.SERIES.BASE);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch series"));
  }
};

export const getSeriesById = async (id) => {
  try {
    return await api.get(`${API_ENDPOINTS.SERIES.BASE}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch series details"));
  }
};

export const createSeries = async (payload) => {
  try {
    return await api.post(API_ENDPOINTS.SERIES.BASE, payload);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create series"));
  }
};

export const updateSeries = async (id, payload) => {
  try {
    return await api.put(`${API_ENDPOINTS.SERIES.BASE}/${id}`, payload);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update series"));
  }
};

export const deleteSeries = async (id) => {
  try {
    return await api.delete(`${API_ENDPOINTS.SERIES.BASE}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete series"));
  }
};

