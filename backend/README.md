# Backend - Campus Sustainability Tracker

This folder contains the FastAPI backend for the Campus Sustainability Tracker application. The backend is organized around a clean package layout with separate modules for API routers, core configuration, data models, services, and machine learning artifacts.

## Backend layout

- `app/api/` - FastAPI route definitions and endpoint handlers
- `app/core/` - application configuration, database session management, and shared core utilities
- `app/models.py` - SQLAlchemy ORM models and schema definitions
- `app/services/` - business logic for prediction, alerts, reports, recommendations, and settings
- `app/ml/` - model loading, artifact management, and anomaly detection code
- `app/main.py` - FastAPI application factory and startup configuration
- `requirements.txt` - backend Python dependencies
- `Dockerfile` - backend Docker image build definition
- `.env.example` - example environment variables for local development

## Local development

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
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

4. The API will be available at `http://localhost:8000/api/v1`.

## Environment variables

The backend loads settings from `.env` using `pydantic-settings`. Key variables include:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `MODEL_ARTIFACTS_DIR`
- `REPORT_OUTPUT_DIR`

## Migrations

The backend uses Alembic for database migrations. To run migrations:

```bash
cd backend
alembic upgrade head
```

If you add or change models, generate a new migration:

```bash
cd backend
alembic revision --autogenerate -m "Add new backend model"
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

## Testing

Run backend tests from the repository root:

```bash
cd backend
pytest
```
