import api from "./api";
import { API_ENDPOINTS } from "../config/api.config";
import { extractErrorMessage } from "./apiError";

export const getAdminPayments = async () => {
  try {
    return await api.get(API_ENDPOINTS.PAYMENT.RECORDS_ALL);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch admin payment records"));
  }
};

export const getMyPayments = async () => {
  try {
    return await api.get(API_ENDPOINTS.PAYMENT.ME);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch user payment history"));
  }
};

export const createPaymentOrderApi = async (payload) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.PAYMENT.CREATE_ORDER, payload);
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to create payment order"));
  }
};

export const verifyPaymentApi = async (payload) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.PAYMENT.VERIFY, payload);
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Payment verification failed"));
  }
};

export const paymentSuccessApi = async (payload) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.AUTH.PAYMENT_SUCCESS, payload);
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Payment update failed"));
  }
};

