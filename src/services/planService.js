import api from "./api";

export const getPlans = async () => {
  return await api.get("/plans");
};

export const createPlan = async (payload) => {
  return await api.post("/plans", payload);
};

export const updatePlan = async (id, payload) => {
  return await api.put(`/plans/${id}`, payload);
};

export const deletePlan = async (id) => {
  return await api.delete(`/plans/${id}`);
};
