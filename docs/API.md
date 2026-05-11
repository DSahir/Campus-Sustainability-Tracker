# Campus Sustainability Tracker - API Documentation

## Overview

The Campus Sustainability Tracker API provides RESTful endpoints for monitoring campus resource usage, managing sustainability data, and generating reports. The API is built with FastAPI and follows REST conventions with JSON responses.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication

### JWT Token Authentication
Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Login Endpoint
**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "string",
    "role": "administrator|facility_manager|student"
  }
}
```

**Status Codes:**
- `200`: Successful authentication
- `401`: Invalid credentials

## Core Endpoints

### Metrics

#### Get Sustainability Summary
**GET** `/metrics/summary`

Retrieve campus-wide sustainability metrics summary.

**Response:**
```json
{
  "campus": "North Campus",
  "generated_at": "2026-04-09T09:00:00Z",
  "energy_kwh": 18250,
  "water_gallons": 96500,
  "waste_kg": 2140,
  "co2_tons": 15.8,
  "trend": "improving|declining|stable"
}
```

**Status Codes:**
- `200`: Success

### Buildings

#### List Buildings
**GET** `/buildings`

Retrieve all campus buildings.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Library Building",
    "address": "123 College Ave",
    "campus": "North Campus"
  }
]
```

**Status Codes:**
- `200`: Success

### Alerts

#### Get Alerts
**GET** `/alerts`

Retrieve resource usage alerts.

**Query Parameters:**
- `building_id` (optional): Filter by building ID
- `severity` (optional): Filter by severity (`critical`, `warning`)

**Response:**
```json
[
  {
    "id": 1,
    "building_id": 1,
    "resource_type": "energy",
    "threshold": 1000,
    "current_value": 1200,
    "severity": "critical",
    "timestamp": "2026-04-09T09:00:00Z",
    "message": "Energy usage exceeded threshold by 20%"
  }
]
```

**Status Codes:**
- `200`: Success

### Predictions

#### Predict Resource Usage
**GET** `/predict`

Predict resource usage based on current parameters.

**Query Parameters:**
- `lag1` (required): Most recent reading (float)
- `lag24` (required): Reading from same hour one day ago (float)
- `hour` (required): Hour of day (0-23)
- `dayofweek` (required): Day of week (0-6, Monday=0)
- `resource_type` (optional): Resource type (`energy`, `water`, `waste`, `co2`) - default: `energy`
- `building_id` (optional): Building ID for building-specific prediction

**Response:**
```json
{
  "prediction": 1250.5,
  "confidence": 0.85,
  "resource_type": "energy",
  "building_id": 1,
  "timestamp": "2026-04-09T10:00:00Z"
}
```

#### Forecast Building Usage
**GET** `/predict/{building_id}`

Generate multi-day forecast for a specific building.

**Path Parameters:**
- `building_id`: Building ID (integer)

**Query Parameters:**
- `horizon`: Forecast horizon (e.g., "7d" for 7 days) - default: "7d"
- `resource_type`: Resource type - default: "energy"
- `hour`: Reference hour (0-23) - default: current hour
- `dayofweek`: Reference day of week (0-6) - default: current day

**Response:**
```json
[
  {
    "timestamp": "2026-04-10T09:00:00Z",
    "predicted_energy": 1150.2,
    "confidence": 0.82
  },
  {
    "timestamp": "2026-04-11T09:00:00Z",
    "predicted_energy": 1180.5,
    "confidence": 0.79
  }
]
```

**Status Codes:**
- `200`: Success
- `400`: Invalid horizon format
- `404`: Building not found

### Recommendations

#### Get Recommendations
**GET** `/recommendations`

Retrieve sustainability recommendations.

**Query Parameters:**
- `building_id` (optional): Filter by building ID

**Response:**
```json
[
  {
    "id": 1,
    "building_id": 1,
    "title": "Optimize HVAC Schedule",
    "description": "Adjust heating/cooling schedule to reduce energy consumption during off-hours",
    "impact_estimate": "15% energy reduction",
    "implementation_cost": "Low",
    "priority": "high"
  }
]
```

**Status Codes:**
- `200`: Success

#### Get Building Recommendations
**GET** `/recommendations/{building_id}`

Get recommendations specific to a building.

**Path Parameters:**
- `building_id`: Building ID (integer)

**Response:** Same as above, filtered by building.

### Reports

#### List Reports
**GET** `/reports`

List all generated reports.

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "campus": "north-campus",
      "generated_on": "2026-04-09",
      "status": "available",
      "default_filename": "North_Campus_Report_2026-04-09.pdf"
    }
  ]
}
```

#### Download Report
**GET** `/reports/download`

Generate and download a PDF report.

**Query Parameters:**
- `campus` (optional): Campus name - default: "north-campus"
- `filename` (optional): Custom filename - default: auto-generated

**Response:** PDF file stream with appropriate headers.

**Status Codes:**
- `200`: Success

### Settings

#### Get Thresholds
**GET** `/settings/thresholds`

Retrieve current monitoring thresholds.

**Response:**
```json
{
  "energy_limit": 1000,
  "water_limit": 5000,
  "waste_limit": 200,
  "co2_limit": 10.0
}
```

**Status Codes:**
- `200`: Success

#### Update Thresholds
**PUT** `/settings/thresholds`

Update monitoring thresholds. Requires administrator privileges.

**Request Body:**
```json
{
  "energy_limit": 1200,
  "water_limit": 5500,
  "waste_limit": 250,
  "co2_limit": 12.0
}
```

**Response:**
```json
{
  "message": "Thresholds updated successfully",
  "updated_thresholds": {
    "energy_limit": 1200,
    "water_limit": 5500,
    "waste_limit": 250,
    "co2_limit": 12.0
  }
}
```

**Status Codes:**
- `200`: Success
- `403`: Insufficient permissions
- `422`: Invalid threshold values

## Data Models

### Resource Types
- `energy`: Electricity consumption (kWh)
- `water`: Water usage (gallons)
- `waste`: Waste generation (kg)
- `co2`: Carbon dioxide emissions (tons)

### User Roles
- `administrator`: Full system access
- `facility_manager`: Building and alert management
- `student`: Read-only dashboard access

### Alert Severity Levels
- `critical`: Immediate action required
- `warning`: Monitor and plan mitigation
- `info`: General notification

## Error Handling

All endpoints return standardized error responses:

```json
{
  "detail": "Error description",
  "type": "error_type",
  "status_code": 400
}
```

### Common HTTP Status Codes
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authenticated requests: 1000/hour
- Unauthenticated requests: 100/hour

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` (optional): Page number (1-based) - default: 1
- `size` (optional): Items per page - default: 50, max: 100

**Response:**
```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "size": 50,
  "pages": 3
}
```

## Versioning

The API uses URL path versioning (`/api/v1/`). Future versions will be added as `/api/v2/`, etc.

## SDKs and Libraries

### JavaScript/TypeScript Client
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Example usage
const metrics = await api.get('/metrics/summary');
const buildings = await api.get('/buildings');
```

### Python Client
```python
import requests

headers = {'Authorization': f'Bearer {token}'}
response = requests.get('http://localhost:8000/api/v1/metrics/summary', headers=headers)
data = response.json()
```

## Webhooks (Future)

The API will support webhooks for real-time notifications:
- Alert triggers
- Threshold breaches
- Report generation completion

## Changelog

### Version 1.0.0 (May 2026)
- Initial API release
- Core CRUD operations for all resources
- JWT authentication
- Basic reporting and predictions
- Role-based access control

---

**API Version**: 1.0.0
**Last Updated**: May 11, 2026
**Contact**: Development Team
