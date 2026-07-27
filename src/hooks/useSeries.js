import { useState, useEffect, useCallback } from "react";
import { getSeries } from "../services/seriesService";

export const useSeries = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSeries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getSeries();
      const seriesOnly = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.data) ? response.data.data : []);
      setSeriesList(seriesOnly);
      setError("");
      return seriesOnly;
    } catch (err) {
      console.error("[API] Failed to load series", err);
      setSeriesList([]);
      setError("Failed to load series. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSeries();
  }, [loadSeries]);

  return { seriesList, setSeriesList, loading, error, loadSeries };
};
