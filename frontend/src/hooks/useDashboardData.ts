import { useEffect, useState } from "react";
import type { DashboardResponse } from "../types/api";
import {
  getDashboardSummary,
  getBuildingComparison,
  getTrendData,
  getWasteBreakdown,
  getRecommendations,
} from "../services/dashboard";

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

        const [
          summary,
          buildingComparison,
          trends,
          wasteBreakdown,
          recommendations,
        ] = await Promise.all([
          getDashboardSummary(),
          getBuildingComparison(),
          getTrendData(),
          getWasteBreakdown(),
          getRecommendations(),
        ]);

        const result: DashboardResponse = {
          summary: {
            energyUsage: summary.energy,
            waterUsage: summary.water,
            co2Emissions: summary.co2,
          },
          buildingComparison,
          trends,
          wasteBreakdown,
          recommendations,
          alerts: [],
        };

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