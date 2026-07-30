import api from "./api";
import { API_ENDPOINTS } from "../config/api.config";
import { extractErrorMessage } from "./apiError";

export const getOffers = async () => {
  try {
    return await api.get(API_ENDPOINTS.OFFERS.BASE);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch offers"));
  }
};

export const getAdminOffers = async () => {
  try {
    return await api.get(API_ENDPOINTS.OFFERS.ADMIN_ALL);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch admin offers"));
  }
};

export const createOffer = async (payload) => {
  try {
    return await api.post(API_ENDPOINTS.OFFERS.BASE, payload);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create offer"));
  }
};

export const updateOffer = async (id, payload) => {
  try {
    return await api.put(`${API_ENDPOINTS.OFFERS.BASE}/${id}`, payload);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update offer"));
  }
};

export const deleteOffer = async (id) => {
  try {
    return await api.delete(`${API_ENDPOINTS.OFFERS.BASE}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete offer"));
  }
};

