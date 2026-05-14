import api from "./api";

const extractErrorMessage = (error, fallbackMessage) => {
  if (error?.code === "ERR_NETWORK" || !error?.response) {
    return "Unable to reach server. Start backend with: npm run dev (root) or npm --prefix backend run dev";
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

export const loginApi = async ({ email, password }) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Login failed"));
  }
};

export const registerApi = async ({ name, email, password, referredBy }) => {
  try {
    const { data } = await api.post("/auth/register", {
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

export const paymentSuccessApi = async ({ plan }) => {
  try {
    const { data } = await api.post("/auth/payment-success", { plan });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Payment update failed"));
  }
};

export const forgotPasswordApi = async ({ email }) => {
  try {
    const { data } = await api.post("/auth/send-otp", { email });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to send reset email"));
  }
};

export const sendOtpApi = async ({ email }) => {
  try {
    const { data } = await api.post("/auth/send-otp", { email });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to send OTP"));
  }
};

export const verifyOtpApi = async ({ email, otp }) => {
  try {
    const { data } = await api.post("/auth/verify-otp", { email, otp });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to verify OTP"));
  }
};

export const resetPasswordWithOtpApi = async ({ email, newPassword }) => {
  try {
    const { data } = await api.post("/auth/reset-password", { email, newPassword });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to reset password"));
  }
};

export const resetPasswordApi = async ({ token, password }) => {
  try {
    const { data } = await api.post(`/auth/reset-password/${token}`, { password });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to reset password"));
  }
};

export const updateProfileApi = async ({ name, email, password }) => {
  try {
    const { data } = await api.put("/users/update-profile", { name, email, password });
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to update profile"));
  }
};

export const createPaymentOrderApi = async ({ amount, planId, planName }) => {
  try {
    const { data } = await api.post("/payment/create-order", {
      amount,
      planId,
      planName,
    });

    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Unable to create payment order"));
  }
};

export const verifyPaymentApi = async (payload) => {
  try {
    const { data } = await api.post("/.payment/verify", payload);
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Payment verification failed"));
  }
};
