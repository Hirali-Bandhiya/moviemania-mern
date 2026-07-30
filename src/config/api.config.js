import { ENV_CONFIG } from "./env.config";

export const API_BASE_URL = ENV_CONFIG?.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PAYMENT_SUCCESS: "/auth/payment-success",
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USERS: {
    UPDATE_PROFILE: "/users/update-profile",
  },
  PAYMENT: {
    CREATE_ORDER: "/payment/create-order",
    VERIFY: "/payment/verify",
  },
};

