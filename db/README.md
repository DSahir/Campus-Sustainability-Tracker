# Database Workflow

This project uses PostgreSQL with SQLAlchemy models and Alembic migrations.

## Database configuration

Database settings are read from the project `.env` file.

Required variables:

```env
POSTGRES_DB=sustainability
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

When running inside Docker Compose, the backend connects to PostgreSQL using the host name `db`.

## Running the system

Start the full stack:

```bash
docker compose up --build
```

The main containers are:

* `sustainability-db`
* `sustainability-backend`
* `sustainability-frontend`

## Applying migrations

Run Alembic migrations inside the backend container:

```bash
docker exec -it sustainability-backend alembic upgrade head
```

Current migration:

```text
001_schema_updates
```

This migration adds:

* `predictions` table
* index on `resource_readings(building_id, type, ts)`

## Loading real processed data

The processed sustainability dataset is stored at:

```text
data/processed/sustainability_readings_subset.csv
```

Load it into PostgreSQL with:

```bash
docker exec -it sustainability-backend python scripts/load_real_data.py --reset
```

The loader inserts data into:

* `buildings`
* `resource_readings`

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

## Verifying data in PostgreSQL

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

Expected index:

```text
idx_resource_readings_building_type_ts
```

## Dataset notes

The processed dataset is based on BDG2 building meter data.

* Energy readings are derived from BDG2 electricity data.
* Water readings are derived from BDG2 water data.
* CO2 readings are estimated from energy readings using an emissions factor.
* Waste readings are proxy estimates derived from energy activity.
* Waste breakdown data is also available for dashboard visualization.

Raw BDG2 files are not committed because they are large. Only processed subsets are stored in the repository.
