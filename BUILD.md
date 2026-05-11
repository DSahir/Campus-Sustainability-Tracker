# Build & Deployment Guide - Campus Sustainability Tracker

## Overview
The Campus Sustainability Tracker is a full-stack web application with a React frontend, FastAPI backend, and PostgreSQL database. This guide provides comprehensive instructions for building, running, and deploying the application.

## Prerequisites

### System Requirements
- **Python**: 3.10 or higher
- **Node.js**: 18.0 or higher
- **Docker**: 20.10 or higher
- **Docker Compose**: 2.0 or higher
- **PostgreSQL**: 13 or higher (for local development without Docker)

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
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# POSTGRES_DB=sustainability_db
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=your_password
# POSTGRES_HOST=localhost
# POSTGRES_PORT=5432
```

### 3. Launch All Services
```bash
# Start all services (backend, frontend, database)
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432

## Manual Development Setup

### Backend Setup

#### 1. Install Python Dependencies
```bash
cd backend
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
```

#### 2. Database Setup
```bash
# Option A: Using Docker (recommended)
docker run -d \
  --name sustainability-postgres \
  -e POSTGRES_DB=sustainability_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:16-alpine

# Option B: Local PostgreSQL installation
# Ensure PostgreSQL is running and create the database
createdb sustainability_db
```

#### 3. Run Database Migrations
```bash
# From project root
cd backend
alembic upgrade head
```

#### 4. Seed Database (Optional)
```bash
# From project root
python -m backend.seed
```

#### 5. Start Backend Server
```bash
# Development mode with auto-reload
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

# Or for local development without PostgreSQL
export DATABASE_URL=sqlite:///backend/dev.db
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

#### 1. Install Node.js Dependencies
```bash
cd frontend
npm install
```

#### 2. Start Development Server
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build
npm run preview
```

#### 3. Run Frontend Tests
```bash
npm run test
```

## Production Deployment

### Using Docker Compose

#### 1. Production Configuration
```bash
# Create production environment file
cp .env.example .env.production
# Edit .env.production with production values
```

#### 2. Build and Deploy
```bash
# Build production images
docker-compose -f docker-compose.yml build

# Start production services
docker-compose -f docker-compose.yml up -d
```

### Manual Production Deployment

#### Backend Production Deployment
```bash
# Install production dependencies
cd backend
pip install -r requirements.txt

# Set production environment variables
export DATABASE_URL="postgresql://user:password@host:port/db"
export ENVIRONMENT=production

# Start with production ASGI server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Frontend Production Build
```bash
cd frontend
npm run build

# Serve static files (using nginx, Apache, etc.)
# Copy dist/ contents to web server
```

## Testing

### Backend Testing
```bash
# From project root
pytest

# With coverage report
pytest --cov=backend --cov-report=html

# Specific test file
pytest tests/test_api.py -v
```

### Frontend Testing
```bash
cd frontend
npm run test
```

### Integration Testing
```bash
# Ensure all services are running
docker-compose up -d

# Run integration tests
pytest tests/ -k "integration"
```

## Database Management

### Migrations
```bash
cd backend

# Create new migration after model changes
alembic revision --autogenerate -m "Add new feature"

# Apply migrations
alembic upgrade head

# Rollback migration
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

#### Backend Won't Start
```bash
# Check database connection
python -c "from backend.app.core.database import get_db; next(get_db())"

# Check environment variables
echo $DATABASE_URL
```

#### Frontend Build Fails
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Issues
```bash
# Check PostgreSQL container
docker ps | grep postgres

# Check container logs
docker logs sustainability-db

# Test connection
docker exec -it sustainability-db psql -U postgres -d sustainability_db
```

### Logs
```bash
# Backend logs
docker logs sustainability-backend

# Frontend logs (if containerized)
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
- `VITE_API_BASE_URL`: Backend API base URL (default: http://localhost:8000/api/v1)

## Performance Optimization

### Backend
- Use Gunicorn for production serving
- Enable database connection pooling
- Configure proper logging levels
- Use Redis for caching (future enhancement)

### Frontend
- Enable gzip compression
- Use CDN for static assets
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
- [ ] Regular security updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run full test suite
5. Submit pull request

## Support

For issues and questions:
1. Check this documentation
2. Review GitHub Issues
3. Contact the development team

---

**Last Updated**: May 11, 2026
**Version**: 1.0.0
