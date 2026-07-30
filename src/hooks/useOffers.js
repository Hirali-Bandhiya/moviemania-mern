import { useState, useEffect, useCallback } from "react";
import { getOffers, getAdminOffers } from "../services/offerService";
import { logger } from "../utils/logger";

export const useOffers = (isAdmin = false) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOffers = useCallback(async () => {
    setLoading(true);
    try {
      const response = isAdmin ? await getAdminOffers() : await getOffers();
      const rawData = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.data) ? response.data.data : []);
      setOffers(rawData);
      setError("");
      return rawData;
    } catch (err) {
      logger.error("Failed to load offers", err);
      setOffers([]);
      setError("Failed to load offers. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  return { offers, setOffers, loading, error, loadOffers };
};
