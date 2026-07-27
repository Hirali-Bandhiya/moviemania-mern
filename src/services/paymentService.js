import api from "./api";

export const getAdminPayments = async () => {
  return await api.get("/payments/records/all");
};

export const getMyPayments = async () => {
  return await api.get("/payments/me");
};

export const createPaymentOrderApi = async (payload) => {
  return await api.post("/payment/create-order", payload);
};

export const verifyPaymentApi = async (payload) => {
  return await api.post("/payment/verify", payload);
};

export const paymentSuccessApi = async (payload) => {
  return await api.post("/auth/payment-success", payload);
};
