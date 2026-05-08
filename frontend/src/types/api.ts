export type Role = "admin" | "facility_manager" | "student";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  role: Role;
}

export interface SummaryMetrics {
  energy: number;
  water: number;
  co2: number;
  energyChange: number;
  waterChange: number;
  co2Change: number;
}

export interface TrendPoint {
  date: string;
  energy: number;
  water: number;
  co2: number;
  predictedEnergy?: number;
  energyLower?: number;
  energyUpper?: number;
}

export interface BuildingUsage {
  building: string;
  energy: number;
  water: number;
  co2: number;
}

export interface WasteBreakdown {
  category: string;
  value: number;
}

export interface AlertItem {
  id: number;
  severity: "low" | "medium" | "high";
  message: string;
}

export interface Building {
  id: number;
  name: string;
}

export interface RecommendationItem {
  id: number;
  title: string;
  description: string;
  category: "energy" | "water" | "waste" | "co2";
  impact: "low" | "medium" | "high";
}

export interface DashboardResponse {
  summary: SummaryMetrics;
  trends: TrendPoint[];
  buildingComparison: BuildingUsage[];
  wasteBreakdown: WasteBreakdown[];
  alerts: AlertItem[];
  buildings: Building[];
  recommendations: RecommendationItem[];
}