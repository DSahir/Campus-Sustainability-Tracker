# Campus Sustainability Tracker

## Overview

The **Campus Sustainability Tracker** is a web-based full-stack platform designed to monitor, forecast, and optimize sustainability-related resource usage across campus buildings.

The platform tracks **energy, water, waste, and CO₂ emissions** through centralized dashboards, machine-learning-supported predictions, automated alerts, recommendations, and downloadable reports. It is designed to help university administrators, facility managers, IT administrators, and students better understand campus resource consumption and support data-driven sustainability decisions.

## Stakeholders

- University Administrators
- Facility Managers
- IT Administrators
- Students

## Key Features

1. **Integrated Sustainability Impact Dashboard**
   - KPI cards for energy, water, waste, and CO₂ metrics
   - Trend visualizations for campus resource usage
   - Building-level comparison views
   - Role-based dashboards for different user types

2. **AI-Driven Predictive Analytics**
   - Short-term forecasting for campus resource consumption
   - Prediction support for building-level resource usage
   - Machine-learning workflow using XGBoost and baseline models

3. **Alerting and Threshold Monitoring**
   - Configurable thresholds for energy, water, and CO₂ monitoring
   - Severity-based alerts for abnormal resource usage
   - Dashboard display for active alerts

4. **Reports and Recommendations**
   - PDF sustainability report generation
   - Campus and building-level summary reporting
   - Sustainability recommendations for energy, water, waste, and operational improvements

5. **Role-Based Access Control**
   - Admin, User, and Student access levels
   - Protected frontend routes
   - Role-specific dashboard views and controls

## Repository Structure

```text
frontend/    - React + Vite user interface and dashboards
backend/     - FastAPI backend APIs, analytics, data processing, ML, and services
docs/        - Project documentation
data/        - Datasets and processed sustainability data
tests/       - Backend, database, and API tests
scripts/     - Automation, data loading, and ML scripts
db/          - Database workflow documentation
alembic/     - Database migration files
docker/      - Docker-related frontend configuration
```

## Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Recharts, React Router
- **Backend:** FastAPI, Uvicorn, SQLAlchemy, Pydantic, Alembic
- **Database:** PostgreSQL
- **Machine Learning:** XGBoost, scikit-learn, NumPy, Pandas, Joblib, ONNX
- **Testing and DevOps:** pytest, httpx, Docker Compose, GitHub CI
- **Reporting:** FPDF and backend report generation service

## Build and Deployment

For comprehensive build and deployment instructions, see [BUILD.md](BUILD.md).

## Backend Build and Run

1. Change to the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   python3 -m pip install --upgrade pip
   python3 -m pip install -r requirements.txt
   ```

3. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

4. Start the backend locally:

   ```bash
   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   For local development without PostgreSQL, set:

   ```bash
   export DATABASE_URL=sqlite:///backend/dev.db
   ```

5. Run the backend Docker image:

   ```bash
   docker build -t campus-sustainability-backend .
   docker run --rm -p 8000:8000 campus-sustainability-backend
   ```

## Full Stack with Docker

From the repository root, run:

```bash
docker compose up --build
```

Default local services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api/v1`
- Backend health check: `http://localhost:8000/health`
- PostgreSQL: `localhost:5432`

## Data Loading

After starting the Docker services, load the processed sustainability dataset:

```bash
docker exec -it sustainability-backend python scripts/load_real_data.py --reset
```

Expected final database load:

```text
5 buildings
14,400 resource readings
3,600 readings per resource type
Energy, Water, CO₂, and Waste
```

## Local Test Execution

From the repository root, run:

```bash
pytest
```

The project uses `pytest.ini` to add `backend` to the Python path and run tests from the `tests/` directory.

Test coverage includes authentication, prediction, alerts, reports, settings, recommendations, metrics, buildings, and database pipeline checks.

## API Endpoints

- `POST /api/v1/auth/login`
- `GET /api/v1/buildings`
- `GET /api/v1/metrics/summary`
- `GET /api/v1/alerts`
- `GET /api/v1/predict`
- `GET /api/v1/predict/{building_id}?horizon=7d`
- `GET /api/v1/reports`
- `GET /api/v1/reports/download`
- `GET /api/v1/recommendations`
- `GET /api/v1/settings/thresholds`
- `PUT /api/v1/settings/thresholds`
- `GET /health`

## Future Enhancements

- Real-time data ingestion from smart meters and building management systems
- Weather API integration for stronger forecasting
- Ensemble machine-learning models for improved time-series predictions
- Email and SMS alert notifications
- Excel export and configurable dashboard widgets
- Carbon pricing, scorecards, and sustainability benchmarking

## Team Members

- Dhanshri Ahir
- Akshada Duche
- Rufina Lourdes Rajesh
- Srivarsh Cirigiri
