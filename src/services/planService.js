import api from "./api";
import { API_ENDPOINTS } from "../config/api.config";
import { extractErrorMessage } from "./apiError";

export const getPlans = async () => {
  try {
    return await api.get(API_ENDPOINTS.PLANS.BASE);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch subscription plans"));
  }
};

export const createPlan = async (payload) => {
  try {
    return await api.post(API_ENDPOINTS.PLANS.BASE, payload);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create subscription plan"));
  }
};

export const updatePlan = async (id, payload) => {
  try {
    return await api.put(`${API_ENDPOINTS.PLANS.BASE}/${id}`, payload);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update subscription plan"));
  }
};

export const deletePlan = async (id) => {
  try {
    return await api.delete(`${API_ENDPOINTS.PLANS.BASE}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete subscription plan"));
  }
};

