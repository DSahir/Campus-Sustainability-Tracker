# Campus-Sustainability-Tracker

## Overview
The Campus Sustainability Tracker is a web-based platform designed to monitor and optimize energy, water, waste, and computing resource usage across campus buildings and IT infrastructure. This project integrates real-time monitoring, AI-driven predictions, and automated optimization.

## Stakeholders
- University Administrators
- Facility Managers
- IT Administrators
- Students

## Key Features
1. Integrated Sustainability Impact Dashboard
2. AI-Driven Predictive Analytics
3. Automated Resource Optimization & Policy Engine
4. Role-Based Access Control (RBAC) & Alerting System

## Repository Structure
frontend/ - user interface and dashboards  
backend/ - APIs, analytics and data processing (organized under backend/app/{api,core,models,services,ml})  
docs/ - project documentation  
data/ - datasets  
tests/ - testing files  
scripts/ - automation scripts  

## Scaffolded Stack
- frontend: React + Vite UI connected to FastAPI
- backend: FastAPI with database-backed prediction, alerts, recommendations, reports, and settings persistence
- docker: container setup for full stack

## Build ## Backend Build & Run Deployment

For comprehensive build and deployment instructions, see [BUILD.md](BUILD.md).

## Backend Build ## Backend Build & Run Run
1. Change to the backend folder:
   - `cd backend`
2. Install dependencies:
   - `python3 -m pip install --upgrade pip`
   - `python3 -m pip install -r requirements.txt`
3. Copy the environment template:
   - `cp .env.example .env`
4. Start the backend locally:
   - `uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000`
   - For local development without PostgreSQL, set `DATABASE_URL=sqlite:///backend/dev.db`
5. Run the backend Docker image:
   - `docker build -t campus-sustainability-backend .`
   - `docker run --rm -p 8000:8000 campus-sustainability-backend`

## Local Test Execution
- From the repository root:
  - `pytest`
- The project uses `pytest.ini` to add `backend` to Python path and run tests from `tests/`

## API Endpoints
- POST /api/v1/auth/login
- GET /api/v1/buildings
- GET /api/v1/metrics/summary
- GET /api/v1/alerts
- GET /api/v1/predict
- GET /api/v1/predict/{building_id}?horizon=7d
- GET /api/v1/reports
- GET /api/v1/reports/download
- GET /api/v1/recommendations
- GET /api/v1/settings/thresholds
- PUT /api/v1/settings/thresholds

## Team Members
- Dhanshri Ahir
- Akshada Duche
- Rufina Lourdes Rajesh
- Srivarsh Cirigiri