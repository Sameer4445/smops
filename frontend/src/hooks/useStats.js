/**
 * useStats Hook
 * Fetches and returns dashboard statistics
 */

import { useState, useEffect } from "react";
import { fetchStats } from "../services/api";

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchStats();
      setStats(result.data);
    } catch (err) {
      setError(err.message || "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return { stats, loading, error, refresh: loadStats };
};
