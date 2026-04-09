/**
 * Dashboard API — three parallel calls fired on component mount.
 * Spec: "fires three parallel axios.get() calls:
 *        /api/metrics/summary, /api/buildings, and /api/alerts/active"
 *       — sprint2_task_plan.pdf · Step 2
 */
import axiosInstance from './axiosInstance';
import { MetricsSummary, Building, Alert } from '../types';

export const fetchMetricsSummary = (): Promise<MetricsSummary> =>
  axiosInstance
    .get<MetricsSummary>('/api/metrics/summary')
    .then((r) => r.data);

export const fetchBuildings = (): Promise<Building[]> =>
  axiosInstance
    .get<Building[]>('/api/buildings')
    .then((r) => r.data);

export const fetchActiveAlerts = (): Promise<Alert[]> =>
  axiosInstance
    .get<Alert[]>('/api/alerts/active')
    .then((r) => r.data);

/**
 * Fires all three requests in parallel via Promise.all.
 * No intermediate transformation — arrays are passed directly into Recharts.
 */
export const fetchDashboardData = (): Promise<
  [MetricsSummary, Building[], Alert[]]
> =>
  Promise.all([
    fetchMetricsSummary(),
    fetchBuildings(),
    fetchActiveAlerts(),
  ]);