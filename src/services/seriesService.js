import api from "./api";

export const getSeries = async () => {
  return await api.get("/series");
};

export const getSeriesById = async (id) => {
  return await api.get(`/series/${id}`);
};

export const createSeries = async (payload) => {
  return await api.post("/series", payload);
};

export const updateSeries = async (id, payload) => {
  return await api.put(`/series/${id}`, payload);
};

export const deleteSeries = async (id) => {
  return await api.delete(`/series/${id}`);
};
