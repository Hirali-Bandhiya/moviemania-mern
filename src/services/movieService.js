import api from "./api";

export const getMovies = async () => {
  return await api.get("/movies");
};

export const getMovieById = async (id) => {
  return await api.get(`/movies/${id}`);
};

export const createMovie = async (payload) => {
  return await api.post("/movies", payload);
};

export const updateMovie = async (id, payload) => {
  return await api.put(`/movies/${id}`, payload);
};

export const deleteMovie = async (id) => {
  return await api.delete(`/movies/${id}`);
};
