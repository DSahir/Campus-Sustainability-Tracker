import { useEffect, useState } from "react";
import type { DashboardResponse } from "../types/api";
import { getDashboardData } from "../services/dashboard";

interface UseDashboardDataResult {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardData(token: string | null): UseDashboardDataResult {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        setLoading(false);
        setError("Missing auth token.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getDashboardData(token);
        setData(result);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  return { data, loading, error };
}