/**
 * Stub data — used as fallback when the FastAPI backend is not yet available.
 * Mirrors the exact shapes defined in src/types/index.ts.
 * Delete / ignore once all endpoints are live.
 */
import { MetricsSummary, Building, Alert } from '../types';

export const STUB_METRICS: MetricsSummary = {
  energy: { value: 124_520, unit: 'kWh',  trend:  3.2  },
  water:  { value:  89_430, unit: 'gal',  trend: -1.8  },
  co2:    { value:  42_100, unit: 'kg',   trend:  2.1  },

  timeSeries: [
    { date: 'Apr 01', energy: 17_800, water: 12_400, co2: 6_100 },
    { date: 'Apr 02', energy: 16_900, water: 11_800, co2: 5_800 },
    { date: 'Apr 03', energy: 18_200, water: 13_100, co2: 6_300 },
    { date: 'Apr 04', energy: 17_100, water: 12_700, co2: 5_900 },
    { date: 'Apr 05', energy: 18_800, water: 13_600, co2: 6_500 },
    { date: 'Apr 06', energy: 17_600, water: 12_900, co2: 6_100 },
    { date: 'Apr 07', energy: 18_120, water: 12_930, co2: 6_100 },
  ],

  wasteBreakdown: [
    { name: 'Recyclable', value: 38 },
    { name: 'Organic',    value: 27 },
    { name: 'Landfill',   value: 20 },
    { name: 'Compost',    value: 10 },
    { name: 'Hazardous',  value:  5 },
  ],
};

export const STUB_BUILDINGS: Building[] = [
  { id: 1, name: 'Lederle',             energy: 32_400, water: 18_700, co2: 11_200 },
  { id: 2, name: 'Morrill',             energy: 28_100, water: 15_300, co2:  9_800 },
  { id: 3, name: 'Goessmann',           energy: 24_700, water: 13_900, co2:  8_500 },
  { id: 4, name: 'Integrated Sciences', energy: 20_600, water: 11_200, co2:  7_100 },
  { id: 5, name: 'Recreation Center',   energy: 18_720, water: 30_330, co2:  5_500 },
];

export const STUB_ALERTS: Alert[] = [
  {
    id: 1, building: 'Lederle', type: 'energy',
    message:   'Energy usage 23 % above threshold',
    severity:  'high',
    timestamp: '2026-04-07T08:14:00Z',
  },
  {
    id: 2, building: 'Morrill', type: 'water',
    message:   'Unusual water consumption detected overnight',
    severity:  'medium',
    timestamp: '2026-04-07T06:45:00Z',
  },
  {
    id: 3, building: 'Goessmann', type: 'co2',
    message:   'CO₂ emissions approaching monthly limit',
    severity:  'medium',
    timestamp: '2026-04-06T21:30:00Z',
  },
  {
    id: 4, building: 'Recreation Center', type: 'water',
    message:   'Leak suspected in HVAC system',
    severity:  'high',
    timestamp: '2026-04-06T18:00:00Z',
  },
];