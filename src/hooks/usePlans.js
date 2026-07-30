import { useState, useEffect, useCallback } from "react";
import { getPlans } from "../services/planService";
import { logger } from "../utils/logger";

export const usePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPlans();
      const rawData = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.data) ? response.data.data : []);
      setPlans(rawData);
      setError("");
      return rawData;
    } catch (err) {
      logger.error("Failed to load plans", err);
      setPlans([]);
      setError("Failed to load plans.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  return { plans, setPlans, loading, error, loadPlans };
};
