import axios from "axios";
import type { DashboardResponse } from "../types/api";
import { mockDashboardData } from "../__mocks__/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

export const dashboardApi = axios.create({
  baseURL: API_BASE_URL
});

export async function getDashboardData(token: string): Promise<DashboardResponse> {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDashboardData;
  }

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const [summaryRes, buildingsRes, alertsRes] = await Promise.all([
    dashboardApi.get("/api/metrics/summary", { headers }),
    dashboardApi.get("/api/buildings", { headers }),
    dashboardApi.get("/api/alerts/active", { headers })
  ]);

  return {
    summary: summaryRes.data.summary ?? summaryRes.data,
    trends: summaryRes.data.trends ?? [],
    buildingComparison: summaryRes.data.buildingComparison ?? [],
    wasteBreakdown: summaryRes.data.wasteBreakdown ?? [],
    alerts: alertsRes.data.alerts ?? alertsRes.data,
    buildings: buildingsRes.data.buildings ?? buildingsRes.data,
    recommendations: summaryRes.data.recommendations ?? []
  };
}