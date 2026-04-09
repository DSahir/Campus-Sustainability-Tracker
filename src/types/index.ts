/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export type UserRole = 'admin' | 'facility_manager' | 'student';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  role: UserRole;
}

export interface KPIMetric {
  value: number;
  unit:  string;
  trend: number;
}

export interface TimeSeriesPoint {
  date:   string;  
  energy: number;  
  water:  number;  
  co2:    number;  
}

export interface WasteCategory {
  name:  string;
  value: number;  
}

export interface MetricsSummary {
  energy:         KPIMetric;
  water:          KPIMetric;
  co2:            KPIMetric;
  timeSeries:     TimeSeriesPoint[];
  wasteBreakdown: WasteCategory[];
}

export interface Building {
  id:     number;
  name:   string;
  energy: number;  // kWh
  water:  number;  // gallons
  co2:    number;  // kg
}

export type AlertSeverity = 'low' | 'medium' | 'high';

export interface Alert {
  id:        number;
  building:  string;
  type:      string;
  message:   string;
  severity:  AlertSeverity;
  timestamp: string;  // ISO 8601
}

export interface DashboardData {
  metrics:   MetricsSummary;
  buildings: Building[];
  alerts:    Alert[];
}