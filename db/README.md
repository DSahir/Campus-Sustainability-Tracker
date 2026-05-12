# Database Workflow

This project uses **PostgreSQL** as the main database, **SQLAlchemy ORM** for application models, and **Alembic** for database migrations.

The database stores users, buildings, resource readings, predictions, alerts, recommendations, reports, and configurable threshold settings for the Campus Sustainability Tracker.

## Database Role

The database supports the main platform features by storing:

- User accounts and role information
- Campus building metadata
- Time-series resource readings
- Machine-learning forecast outputs
- Alert records and severity levels
- Sustainability recommendations
- PDF report metadata
- Configurable threshold settings

## Database Configuration

Database settings are read from the project `.env` file.

Required variables:

```env
POSTGRES_DB=sustainability
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

When running inside Docker Compose, the backend connects to PostgreSQL using the host name:

```text
db
```

## Running the System

Start the full stack from the repository root:

```bash
docker compose up --build
```

The main containers are:

- `sustainability-db`
- `sustainability-backend`
- `sustainability-frontend`

Default service ports:

| Service | Port |
| --- | --- |
| Backend | `8000` |
| Frontend | `5173` |
| PostgreSQL | `5432` |

## Applying Migrations

Run Alembic migrations inside the backend container:

```bash
docker exec -it sustainability-backend alembic upgrade head
```

Current migration:

```text
001_schema_updates
```

This migration adds:

- `predictions` table
- Index on `resource_readings(building_id, type, ts)`

Expected index:

```text
idx_resource_readings_building_type_ts
```

## Core Tables

| Table / Entity | Purpose |
| --- | --- |
| `users` | Stores user credentials and role information |
| `buildings` | Stores campus building metadata |
| `resource_readings` | Stores time-series resource usage data by building and resource type |
| `predictions` | Stores forecast values, optional bounds, timestamps, and model version |
| `alerts` | Stores alert messages, metrics, severity, and creation time |
| `recommendations` | Stores sustainability suggestions and estimated impact |
| `reports` | Stores generated report metadata and file path |
| `settings` | Stores configurable threshold values |

## Loading Real Processed Data

The processed sustainability dataset is stored at:

```text
data/processed/sustainability_readings_subset.csv
```

Load it into PostgreSQL with:

```bash
docker exec -it sustainability-backend python scripts/load_real_data.py --reset
```

The loader inserts data into:

- `buildings`
- `resource_readings`

The `--reset` flag removes existing readings for the dataset buildings before reloading.

Expected loaded data:

```text
buildings: 5
resource_readings: 14400
energy: 3600
water: 3600
co2: 3600
waste: 3600
```

## Verifying Data in PostgreSQL

Enter PostgreSQL:

```bash
docker exec -it sustainability-db psql -U user -d sustainability
```

Useful checks:

```sql
\dt
SELECT COUNT(*) FROM buildings;
SELECT COUNT(*) FROM resource_readings;
SELECT type, COUNT(*) FROM resource_readings GROUP BY type;
SELECT * FROM alembic_version;
\di
```

## Dataset Notes

The processed dataset is based on BDG2 building meter data.

- Energy readings are derived from BDG2 electricity data.
- Water readings are derived from BDG2 water data.
- CO₂ readings are estimated from energy readings using an emissions factor.
- Waste readings are proxy estimates derived from energy activity.
- Waste breakdown data is also available for dashboard visualization.

Raw BDG2 files are not committed because they are large. Only processed subsets are stored in the repository.

## Related Files

```text
data/processed/
scripts/load_real_data.py
backend/app/models.py
alembic/
alembic/versions/
docker-compose.yml
.env.example
```

## Notes

- PostgreSQL is the recommended database for full-stack execution.
- Alembic should be used whenever SQLAlchemy models are changed.
- The data loader should be run after migrations are applied.
- The database service is started automatically when using Docker Compose.
