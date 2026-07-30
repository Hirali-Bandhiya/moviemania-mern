import { useState, useEffect, useCallback } from "react";
import { getMovies } from "../services/movieService";
import { logger } from "../utils/logger";

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMovies();
      const rawData = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.data) ? response.data.data : []);
      const moviesOnly = rawData.filter((movie) => String(movie.type || "").toLowerCase() !== "series");
      setMovies(moviesOnly);
      setError("");
      return moviesOnly;
    } catch (err) {
      logger.warn("[API] Failed to fetch movies", err?.message || err);
      setMovies([]);
      setError("Failed to load movies. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, setMovies, loading, error, fetchMovies };
};
