# Campus-Sustainability-Tracker
## Overview
The Campus Sustainability Tracker is a web-based platform designed to monitor and optimize energy, water, waste, and computing resource usage across campus buildings and IT infrastructure.This project integrates real-time monitoring, AI-driven predictions, and automated optimization.

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
backend/ - APIs, analytics and data processing  
docs/ - project documentation  
data/ - datasets  
tests/ - testing files  
scripts/ - automation scripts

## Scaffolded Stack
- `frontend/`: React + Vite placeholder UI wired to the FastAPI API base URL
- `backend/`: FastAPI application with stub routes for all eight use cases
- `docker/`: frontend container assets
- `Dockerfile`: backend image
- `docker-compose.yml`: local multi-container setup for React, FastAPI, and PostgreSQL

## API Stub Endpoints
- `POST /api/v1/auth/login`
- `GET /api/v1/buildings`
- `GET /api/v1/metrics/summary`
- `GET /api/v1/alerts`
- `GET /api/v1/predict`
- `GET /api/v1/reports`
- `GET /api/v1/reports/download`
- `GET /api/v1/recommendations`
- `GET /api/v1/settings/thresholds`

The report download endpoint streams PDF bytes and defaults to filenames in the format `sustainability_report_{campus}_{YYYY-MM-DD}.pdf`. A `filename` query parameter can override the download name.

## Local Run
1. Copy `.env.example` to `.env` if you want to change defaults.
2. Start the stack with `docker compose up --build`.
3. Backend API runs on `http://localhost:8000`.
4. Frontend runs on `http://localhost:5173`.

## Documentation
- [Architecture Diagram](/Users/dhanshri/Documents/Documents - Dhanshri’s MacBook Air/CS520/Campus-Sustainability-Tracker/docs/architecture.md)
- [Tech Stack Justification](/Users/dhanshri/Documents/Documents - Dhanshri’s MacBook Air/CS520/Campus-Sustainability-Tracker/docs/tech-stack.md)

## Team Members
-Dhanshri Ahir
-Akshada Duche
-Rufina Lourdes Rajesh
-Srivarsh Cirigiri
