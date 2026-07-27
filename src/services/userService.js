import api from "./api";

export const getUsers = async () => {
  return await api.get("/users");
};

export const getCurrentUserApi = async () => {
  return await api.get("/users/me");
};

export const updateUser = async (id, payload) => {
  return await api.put(`/users/${id}`, payload);
};

export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};

export const syncWishlistApi = async (movieId) => {
  return await api.put("/users/wishlist", { movieId });
};

export const updateProfileApi = async (payload) => {
  return await api.put("/users/update-profile", payload);
};
