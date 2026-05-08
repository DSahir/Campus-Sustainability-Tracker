import type { DashboardResponse } from "../types/api";

export const mockDashboardData: DashboardResponse = {
  summary: {
    energy: 12450,
    water: 8100,
    co2: 3260,
    energyChange: -4.2,
    waterChange: 2.4,
    co2Change: -3.1
  },

  trends: [
    {
      date: "Mon",
      energy: 1600,
      water: 1100,
      co2: 480,
      predictedEnergy: 1550,
      energyLower: 1470,
      energyUpper: 1630
    },
    {
      date: "Tue",
      energy: 1720,
      water: 1150,
      co2: 500,
      predictedEnergy: 1680,
      energyLower: 1590,
      energyUpper: 1770
    },
    {
      date: "Wed",
      energy: 1580,
      water: 1070,
      co2: 460,
      predictedEnergy: 1620,
      energyLower: 1530,
      energyUpper: 1710
    },
    {
      date: "Thu",
      energy: 1810,
      water: 1180,
      co2: 530,
      predictedEnergy: 1760,
      energyLower: 1660,
      energyUpper: 1860
    },
    {
      date: "Fri",
      energy: 1690,
      water: 1120,
      co2: 490,
      predictedEnergy: 1710,
      energyLower: 1615,
      energyUpper: 1805
    },
    {
      date: "Sat",
      energy: 1410,
      water: 980,
      co2: 420,
      predictedEnergy: 1460,
      energyLower: 1370,
      energyUpper: 1550
    },
    {
      date: "Sun",
      energy: 1320,
      water: 920,
      co2: 380,
      predictedEnergy: 1380,
      energyLower: 1290,
      energyUpper: 1470
    }
  ],

  buildingComparison: [
    { building: "Library", energy: 2800, water: 1800, co2: 1100 },
    { building: "Engineering", energy: 3500, water: 1500, co2: 950 },
    { building: "Student Ctr", energy: 2200, water: 2100, co2: 850 },
    { building: "Dorm A", energy: 1800, water: 1200, co2: 700 },
    { building: "Science", energy: 2600, water: 1700, co2: 900 }
  ],

  wasteBreakdown: [
    { category: "Recycled", value: 42 },
    { category: "Organic", value: 28 },
    { category: "Landfill", value: 20 },
    { category: "E-Waste", value: 10 }
  ],

  alerts: [
    {
      id: 1,
      severity: "high",
      message: "Engineering building crossed energy threshold."
    },
    {
      id: 2,
      severity: "medium",
      message: "Science hall water usage increased by 12%."
    }
  ],

  buildings: [
    { id: 1, name: "Library" },
    { id: 2, name: "Engineering" },
    { id: 3, name: "Student Center" },
    { id: 4, name: "Dorm A" },
    { id: 5, name: "Science Hall" }
  ],

  recommendations: [
  {
    id: 1,
    title: "Optimize HVAC schedule",
    description:
      "Reduce Engineering building HVAC usage during low-occupancy evening hours.",
    category: "energy",
    impact: "high"
  },
  {
    id: 2,
    title: "Reduce water use in Science Hall",
    description:
      "Investigate water usage increase and install low-flow fixtures where needed.",
    category: "water",
    impact: "medium"
  },
  {
    id: 3,
    title: "Improve recycling separation",
    description:
      "Add clearer recycling labels near Student Center waste stations.",
    category: "waste",
    impact: "medium"
  }
  ]
};