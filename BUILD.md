# Build & Deployment Guide - Campus Sustainability Tracker

## Overview

The Campus Sustainability Tracker is a full-stack web application with a React frontend, FastAPI backend, and PostgreSQL database. This guide provides instructions for building, running, testing, and deploying the application.

## Prerequisites

### System Requirements

- **Python**: 3.10 or higher, recommended Python 3.11
- **Node.js**: 18.0 or higher
- **npm**: Installed with Node.js
- **Docker**: 20.10 or higher
- **Docker Compose**: 2.0 or higher
- **PostgreSQL**: 13 or higher, only required for local development without Docker

### Development Tools

- **Git**: For version control
- **VS Code**: Recommended IDE with Python and TypeScript extensions

## Quick Start with Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/DSahir/Campus-Sustainability-Tracker.git
cd Campus-Sustainability-Tracker
```

### 2. Environment Setup

```bash
# Copy environment template if available
cp .env.example .env
```

Update `.env` with your configuration:

```env
POSTGRES_DB=sustainability_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

### 3. Launch All Services

```bash
# Start all services: backend, frontend, and database
docker compose up --build

# Or run in the background
docker compose up -d --build
```

If your Docker version uses the older command format, use:

```bash
docker-compose up --build
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432

## Manual Development Setup

Manual backend commands should be run from the **repository root**, not from inside the `backend` folder. This is required so Python can import the `backend` package correctly.

### Backend Setup

#### 1. Create and Activate a Virtual Environment

From the repository root:

```bash
python3.11 -m venv backend/venv
source backend/venv/bin/activate
```

If `python3.11` is not available, use another Python 3.10+ command available on your system.

#### 2. Install Python Dependencies

```bash
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
```

#### 3. Database Setup

Option A: Use Docker for PostgreSQL, recommended:

```bash
docker run -d \
  --name sustainability-postgres \
  -e POSTGRES_DB=sustainability_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:16-alpine
```

Option B: Use a local PostgreSQL installation:

```bash
createdb sustainability_db
```

Option C: Use SQLite for simple local development:

```bash
export DATABASE_URL=sqlite:///backend/dev.db
```

#### 4. Run Database Migrations

From the repository root:

```bash
alembic upgrade head
```

#### 5. Seed Database, Optional

From the repository root:

```bash
python -m backend.seed
```

#### 6. Start Backend Server

From the repository root:

```bash
python -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend runs at:

```text
http://127.0.0.1:8000
```

Useful backend URLs:

```text
Health check: http://127.0.0.1:8000/health
API base URL: http://127.0.0.1:8000/api/v1
Swagger docs: http://127.0.0.1:8000/docs
ReDoc docs: http://127.0.0.1:8000/redoc
```

### Frontend Setup

Open a second terminal.

#### 1. Install Node.js Dependencies

```bash
cd frontend
npm install
```

#### 2. Start Development Server

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

#### 3. Build for Production

```bash
npm run build
npm run preview
```

#### 4. Run Frontend Tests

```bash
npm run test
```

## Production Deployment

### Using Docker Compose

#### 1. Production Configuration

```bash
cp .env.example .env.production
```

Edit `.env.production` with production values.

#### 2. Build and Deploy

```bash
docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up -d
```

If your Docker version uses the older command format, use:

```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

### Manual Production Deployment

#### Backend Production Deployment

Run these commands from the repository root:

```bash
python3.11 -m venv backend/venv
source backend/venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
```

Set production environment variables:

```bash
export DATABASE_URL="postgresql://user:password@host:port/db"
export ENVIRONMENT=production
```

Start the production ASGI server:

```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Frontend Production Build

```bash
cd frontend
npm install
npm run build
```

The production build output will be generated in:

```text
frontend/dist/
```

Serve the `frontend/dist/` directory using a production web server such as Nginx, Apache, or a static hosting provider.

## Testing

### Backend Testing

From the repository root:

```bash
pytest
```

With coverage report:

```bash
pytest --cov=backend --cov-report=html
```

Run a specific test file:

```bash
pytest tests/test_api.py -v
```

### Frontend Testing

```bash
cd frontend
npm run test
```

### Integration Testing

Start services first:

```bash
docker compose up -d
```

Then run integration tests:

```bash
pytest tests/ -k "integration"
```

## Database Management

### Migrations

Run migration commands from the repository root:

```bash
# Create a new migration after model changes
alembic revision --autogenerate -m "Add new feature"

# Apply migrations
alembic upgrade head

# Roll back one migration
alembic downgrade -1
```

### Backup and Restore

```bash
# Backup database
docker exec sustainability-db pg_dump -U postgres sustainability_db > backup.sql

# Restore database
docker exec -i sustainability-db psql -U postgres sustainability_db < backup.sql
```

## Monitoring and Troubleshooting

### Health Checks

- **Backend Health**: GET http://localhost:8000/health
- **Database Health**: Check Docker container logs
- **Frontend Health**: Access http://localhost:5173

### Common Issues

#### Backend Import Error

If you see:

```text
ModuleNotFoundError: No module named 'backend'
```

make sure you are running the backend command from the repository root, not from inside the `backend` folder:

```bash
python -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Python Version Error

If you see an error like:

```text
TypeError: unsupported operand type(s) for |: 'type' and 'NoneType'
```

you are likely using Python 3.9 or older. Use Python 3.10 or newer, preferably Python 3.11:

```bash
python3.11 -m venv backend/venv
source backend/venv/bin/activate
```

#### Backend Will Not Start

Check the database connection:

```bash
python -c "from backend.app.core.database import get_db; next(get_db())"
```

Check environment variables:

```bash
echo $DATABASE_URL
```

#### Frontend Build Fails

Clear dependencies and reinstall:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Database Connection Issues

Check PostgreSQL container:

```bash
docker ps | grep postgres
```

Check container logs:

```bash
docker logs sustainability-db
```

Test connection:

```bash
docker exec -it sustainability-db psql -U postgres -d sustainability_db
```

### Logs

```bash
# Backend logs
docker logs sustainability-backend

# Frontend logs, if containerized
docker logs sustainability-frontend

# Database logs
docker logs sustainability-db
```

## API Documentation

The backend provides automatic API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## Environment Variables

### Backend

- `DATABASE_URL`: Database connection string
- `POSTGRES_DB`: PostgreSQL database name
- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password
- `POSTGRES_HOST`: PostgreSQL host
- `POSTGRES_PORT`: PostgreSQL port
- `MODEL_ARTIFACTS_DIR`: Path to ML model artifacts
- `REPORT_OUTPUT_DIR`: Path for generated reports

### Frontend

- `VITE_API_BASE_URL`: Backend API base URL, default: `http://localhost:8000/api/v1`

## Performance Optimization

### Backend

- Use multiple workers in production
- Enable database connection pooling
- Configure appropriate logging levels
- Use Redis for caching as a future enhancement

### Frontend

- Enable gzip compression
- Use a CDN for static assets
- Implement code splitting
- Optimize bundle size

## Security Considerations

### Production Checklist

- [ ] Change default database passwords
- [ ] Use HTTPS certificates
- [ ] Configure firewall rules
- [ ] Enable database backups
- [ ] Set up monitoring and alerting
- [ ] Use environment-specific configuration
- [ ] Implement proper logging
- [ ] Apply regular security updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run the full test suite
5. Submit a pull request

## Support

For issues and questions:

1. Check this documentation
2. Review GitHub Issues
3. Contact the development team

---

**Last Updated**: May 11, 2026  
**Version**: 1.0.0
