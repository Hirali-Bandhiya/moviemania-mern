import { ENV_CONFIG } from "./env.config";

export const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

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
    BASE: "/users",
    ME: "/users/me",
    UPDATE_PROFILE: "/users/update-profile",
    WISHLIST: "/users/wishlist",
  },
  MOVIES: {
    BASE: "/movies",
  },
  SERIES: {
    BASE: "/series",
  },
  PLANS: {
    BASE: "/plans",
  },
  OFFERS: {
    BASE: "/offers",
    ADMIN_ALL: "/offers/admin/all",
  },
  PAYMENT: {
    CREATE_ORDER: "/payment/create-order",
    VERIFY: "/payment/verify",
    RECORDS_ALL: "/payments/records/all",
    ME: "/payments/me",
  },
};


