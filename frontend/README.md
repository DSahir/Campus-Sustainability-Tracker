# Frontend - Campus Sustainability Tracker

This folder contains the **React + TypeScript frontend** for the Campus Sustainability Tracker application. The frontend provides the user interface for login, role-based dashboards, KPI cards, charts, alerts, recommendations, settings, and report actions.

## Frontend Responsibilities

- Provide a clean and responsive campus sustainability dashboard
- Display resource KPI cards for energy, water, waste, and CO₂
- Visualize resource trends, building comparisons, forecast comparisons, and waste breakdowns
- Support login and protected dashboard routes
- Render role-based views for Admin, User, and Student users
- Connect to the FastAPI backend through REST APIs
- Display active alerts and sustainability recommendations
- Provide report and threshold-setting interfaces where applicable

## Frontend Layout

```text
frontend/
├── public/                  
├── src/
│   ├── components/          
│   ├── components/charts/
│   ├── components/ui/      
│   ├── context/             
│   ├── hooks/             
│   ├── pages/              
│   ├── services/         
│   ├── test/               
│   ├── types/              
│   ├── App.tsx             
│   └── main.tsx            
├── package.json             
├── tailwind.config.js      
├── vite.config.ts           
└── README.md                
```

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Axios
- Vitest
- Testing Library

## Environment Variables

The frontend uses `VITE_API_BASE_URL` to connect to the backend API.

Example:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

A template is available in:

```text
frontend/.env.example
```

## Local Development

1. Change to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

4. Open the frontend in your browser:

   ```text
   http://localhost:5173
   ```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Builds the frontend for production |
| `npm run preview` | Previews the production build locally |
| `npm run test` | Runs frontend tests with Vitest |

## Docker

The frontend is included in the full-stack Docker Compose setup.

From the repository root, run:

```bash
docker compose up --build
```

Default frontend URL:

```text
http://localhost:5173
```

## Main Routes

| Route | Purpose |
| --- | --- |
| `/login` | User login page |
| `/signup` | User signup page |
| `/forgot-password` | Password recovery page |
| `/dashboard/:role` | Protected role-based dashboard |
| `*` | Not found page |

## Dashboard Features

- KPI cards for energy, water, waste, and CO₂ metrics
- Campus resource trend charts
- Building comparison chart
- Forecast comparison chart
- Waste breakdown visualization
- Active alerts section
- Sustainability recommendations panel
- Threshold and settings controls for authorized users
- Role-based dashboard views for Admin, User, and Student access

## API Integration

Frontend API calls are organized in:

```text
src/services/
```

Dashboard data loading is handled through custom hooks, including:

```text
src/hooks/
```

The frontend communicates with the backend through REST API endpoints such as:

- `/api/v1/auth/login`
- `/api/v1/metrics/summary`
- `/api/v1/buildings`
- `/api/v1/alerts`
- `/api/v1/predict`
- `/api/v1/recommendations`
- `/api/v1/reports`
- `/api/v1/settings/thresholds`

## Testing

Run frontend tests with:

```bash
npm run test
```

Frontend tests are located in:

```text
src/test/
```

## Notes

- The frontend is built with Vite for fast local development.
- Tailwind CSS is used for styling and responsive layout.
- Recharts is used for dashboard visualizations.
- React Router handles page navigation and protected dashboard routes.
- Axios is used for backend API communication.
