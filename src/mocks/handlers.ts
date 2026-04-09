import { http, HttpResponse } from 'msw';

const MOCK_USERS: Record<string, 'admin' | 'facility_manager' | 'student'> = {
  admin:   'admin',
  manager: 'facility_manager',
  student: 'student',
};

export const handlers = [

  http.post('http://localhost:8000/auth/login', async ({ request }) => {
    const body = await request.json() as { username: string; password: string };

    const role = MOCK_USERS[body.username];

    if (!role || body.password !== 'password') {
      return HttpResponse.json(
        { detail: 'Incorrect username or password' },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      access_token: `mock-jwt-${role}-${Date.now()}`,
      token_type:   'bearer',
      role,
    });
  }),

  http.get('http://localhost:8000/api/metrics/summary', () => {
    return HttpResponse.json({
      energy: { value: 124520, unit: 'kWh', trend:  3.2 },
      water:  { value:  89430, unit: 'gal', trend: -1.8 },
      co2:    { value:  42100, unit: 'kg',  trend:  2.1 },
      timeSeries: [
        { date: 'Apr 01', energy: 17800, water: 12400, co2: 6100 },
        { date: 'Apr 02', energy: 16900, water: 11800, co2: 5800 },
        { date: 'Apr 03', energy: 18200, water: 13100, co2: 6300 },
        { date: 'Apr 04', energy: 17100, water: 12700, co2: 5900 },
        { date: 'Apr 05', energy: 18800, water: 13600, co2: 6500 },
        { date: 'Apr 06', energy: 17600, water: 12900, co2: 6100 },
        { date: 'Apr 07', energy: 18120, water: 12930, co2: 6100 },
      ],
      wasteBreakdown: [
        { name: 'Recyclable', value: 38 },
        { name: 'Organic',    value: 27 },
        { name: 'Landfill',   value: 20 },
        { name: 'Compost',    value: 10 },
        { name: 'Hazardous',  value:  5 },
      ],
    });
  }),

  http.get('http://localhost:8000/api/buildings', () => {
    return HttpResponse.json([
      { id: 1, name: 'Lederle',             energy: 32400, water: 18700, co2: 11200 },
      { id: 2, name: 'Morrill',             energy: 28100, water: 15300, co2:  9800 },
      { id: 3, name: 'Goessmann',           energy: 24700, water: 13900, co2:  8500 },
      { id: 4, name: 'ILC',                 energy: 20600, water: 11200, co2:  7100 },
      { id: 5, name: 'Recreation Center',   energy: 18720, water: 30330, co2:  5500 },
    ]);
  }),

  http.get('http://localhost:8000/api/alerts/active', () => {
    return HttpResponse.json([
      {
        id: 1, building: 'Lederle', type: 'energy',
        message:   'Energy usage 23% above threshold',
        severity:  'high',
        timestamp: '2026-04-07T08:14:00Z',
      },
      {
        id: 2, building: 'Morrill', type: 'water',
        message:   'Unusual water consumption detected overnight',
        severity:  'medium',
        timestamp: '2026-04-07T06:45:00Z',
      },
    ]);
  }),
];