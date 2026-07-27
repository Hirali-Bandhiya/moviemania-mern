import api from "./api";

export const getOffers = async () => {
  return await api.get("/offers");
};

export const getAdminOffers = async () => {
  return await api.get("/offers/admin/all");
};

export const createOffer = async (payload) => {
  return await api.post("/offers", payload);
};

export const updateOffer = async (id, payload) => {
  return await api.put(`/offers/${id}`, payload);
};

export const deleteOffer = async (id) => {
  return await api.delete(`/offers/${id}`);
};
