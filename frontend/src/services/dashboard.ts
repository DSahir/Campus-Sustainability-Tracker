import axios from "axios";

const API = "http://localhost:8000/api/v1";

export const getDashboardSummary = async () => {
  const trends = await axios.get(`${API}/analytics/trends`);

  const latest = trends.data[trends.data.length - 1] || {
    actualEnergy: 0,
    water: 0,
    co2: 0,
  };

  return {
    energy: latest.actualEnergy,
    water: latest.water,
    co2: latest.co2,
  };
};

export const getBuildingComparison = async () => {
  const response = await axios.get(`${API}/analytics/buildings`);
  return response.data;
};

export const getTrendData = async () => {
  const response = await axios.get(`${API}/analytics/trends`);
  return response.data;
};

export const getWasteBreakdown = async () => {
  const response = await axios.get(`${API}/analytics/waste`);
  return response.data;
};

export const getRecommendations = async () => {
  const response = await axios.get(`${API}/analytics/recommendations`);
  return response.data;
};