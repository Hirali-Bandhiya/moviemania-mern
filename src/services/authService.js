import api from "./api";
import { API_ENDPOINTS } from "../config/api.config";
import { extractErrorMessage } from "./apiError";
import {
  paymentSuccessApi,
  createPaymentOrderApi,
  verifyPaymentApi,
} from "./paymentService";
import { updateProfileApi } from "./userService";

export { paymentSuccessApi, createPaymentOrderApi, verifyPaymentApi, updateProfileApi };

export const loginApi = async ({ email, password }) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Login failed"));
  }
};

export const registerApi = async ({ name, email, password, referredBy }) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
      referredBy,
    });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Registration failed"));
  }
};

export const forgotPasswordApi = async ({ email }) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.AUTH.SEND_OTP, { email });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to send reset email"));
  }
};

export const sendOtpApi = async ({ email }) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.AUTH.SEND_OTP, { email });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to send OTP"));
  }
};

export const verifyOtpApi = async ({ email, otp }) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to verify OTP"));
  }
};

export const resetPasswordWithOtpApi = async ({ email, newPassword }) => {
  try {
    const { data } = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email, newPassword });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to reset password"));
  }
};

export const resetPasswordApi = async ({ token, password }) => {
  try {
    const { data } = await api.post(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, { password });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to reset password"));
  }
};

