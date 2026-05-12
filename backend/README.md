# Backend - Campus Sustainability Tracker

This folder contains the **FastAPI backend** for the Campus Sustainability Tracker application. The backend provides REST APIs for authentication, campus metrics, building data, machine-learning predictions, alerts, recommendations, threshold settings, and PDF report generation.

The backend is organized using a clean package layout with separate modules for API routes, core configuration, database models, services, and machine learning support.

## Backend Responsibilities

- Provide versioned REST API endpoints under `/api/v1`
- Handle login and role-based access support
- Store and retrieve building and resource usage data
- Generate campus sustainability metrics
- Support short-term resource forecasting
- Store prediction outputs for future forecast tracking
- Detect and return alerts based on configured thresholds
- Generate sustainability recommendations
- Generate and serve PDF sustainability reports
- Connect to PostgreSQL using SQLAlchemy ORM
- Manage database schema changes using Alembic

## Backend Layout

```text
backend/
├── app/
│   ├── api/                 
│   ├── core/                
│   ├── ml/                  
│   ├── services/            
│   ├── main.py              
│   └── models.py            
├── requirements.txt         
├── Dockerfile               
├── seed.py                  
├── .env.example             
└── README.md                
```

## Technology Stack

- FastAPI
- Uvicorn
- SQLAlchemy
- Alembic
- Pydantic and pydantic-settings
- PostgreSQL
- XGBoost
- scikit-learn
- NumPy and Pandas
- Joblib and ONNX Runtime
- FPDF
- pytest and httpx

## Local Development

1. Copy the environment template:

   ```bash
   cd backend
   cp .env.example .env
   ```

2. Install Python dependencies:

   ```bash
   python3 -m pip install --upgrade pip
   python3 -m pip install -r requirements.txt
   ```

3. Run the backend locally:

   ```bash
   export DATABASE_URL=sqlite:///backend/dev.db
   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. The API will be available at:

   ```text
   http://localhost:8000/api/v1
   ```

5. The health check will be available at:

   ```text
   http://localhost:8000/health
   ```

## Environment Variables

The backend loads settings from `.env` using `pydantic-settings`.

Key variables include:

```env
POSTGRES_DB=sustainability
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_HOST=db
POSTGRES_PORT=5432
MODEL_ARTIFACTS_DIR=backend/app/ml/artifacts
REPORT_OUTPUT_DIR=reports_output
```

## Database and Migrations

The backend uses **PostgreSQL** as the main database and **Alembic** for database migrations.

To run migrations locally:

```bash
alembic upgrade head
```

To run migrations inside the Docker backend container:

```bash
docker exec -it sustainability-backend alembic upgrade head
```

If you add or change SQLAlchemy models, generate a new migration:

```bash
alembic revision --autogenerate -m "Add new backend model"
```

Then review the generated migration before applying it.

## Data Loading

The project includes a processed sustainability dataset that can be loaded into the database.

After Docker services are running, load the data with:

```bash
docker exec -it sustainability-backend python scripts/load_real_data.py --reset
```

Expected final load:

```text
5 buildings
14,400 resource readings
3,600 readings per resource type
Energy, Water, CO₂, and Waste
```

## Docker

Build the backend image:

```bash
cd backend
docker build -t campus-sustainability-backend .
```

Run the backend container:

```bash
docker run --rm -p 8000:8000 campus-sustainability-backend
```

For the full application stack, run Docker Compose from the repository root:

```bash
docker compose up --build
```

Default services:

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5432`

## Main API Endpoints

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

## Core Data Models

The backend data model includes:

- `User` - user credentials and role information
- `Building` - campus building metadata
- `ResourceReading` - time-series resource usage data
- `Prediction` - forecast output, bounds, and model version
- `Alert` - alert metric, severity, message, and creation time
- `Recommendation` - sustainability recommendations
- `Report` - generated report metadata and file path
- `Setting` - configurable threshold values

## Testing

Run backend tests from the repository root:

```bash
pytest
```

The test configuration uses `pytest.ini` to configure the backend package path and the `tests/` directory.

Tested areas include:

- Authentication
- Metrics
- Buildings
- Predictions
- Alerts
- Reports
- Recommendations
- Settings
- Database pipeline checks

## Notes

- Machine learning artifacts are stored under `app/ml/`.
- Generated PDF reports are written to the configured `REPORT_OUTPUT_DIR`.
- The backend is designed to run as part of the full-stack Docker Compose setup with the frontend and PostgreSQL database.
