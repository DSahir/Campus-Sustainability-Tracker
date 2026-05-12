# Alembic Migrations

This directory contains the Alembic migration setup for the **Campus Sustainability Tracker** database.

The project uses:

- **PostgreSQL** as the main database
- **SQLAlchemy ORM** for database models
- **Alembic** for schema migrations

## Purpose

Alembic is used to manage database schema changes over time. When tables, columns, indexes, or model definitions are added or updated in the backend, Alembic migrations are used to apply those changes to the PostgreSQL database in a controlled way.

## Main Files

```text
alembic/
├── env.py                  # Alembic environment configuration
├── script.py.mako          # Template used when generating migration files
├── versions/               # Migration version files
└── README                  # Alembic documentation
```

The root-level Alembic configuration file is:

```text
alembic.ini
```

## Current Migration Support

The migration setup supports schema updates such as:

- Creating new database tables
- Updating existing tables
- Adding indexes for better query performance
- Tracking applied migrations through the `alembic_version` table

## Current Project Migration

The current project migration includes support for:

- A `predictions` table for forecast storage
- An index on `resource_readings(building_id, type, ts)` for faster time-series queries

Expected index:

```text
idx_resource_readings_building_type_ts
```

## Running Migrations

After starting the Docker services, run migrations from the repository root:

```bash
docker exec -it sustainability-backend alembic upgrade head
```

This applies all pending migrations to the PostgreSQL database.

## Creating a New Migration

After changing SQLAlchemy models, create a new migration with:

```bash
alembic revision --autogenerate -m "Describe database change"
```

Then review the generated migration file before applying it.

## Verifying Migration Status

To check the migration version stored in PostgreSQL:

```bash
docker exec -it sustainability-db psql -U user -d sustainability
```

Then run:

```sql
SELECT * FROM alembic_version;
```

## Notes

- Migration files are stored in `alembic/versions/`.
- The database connection is configured through project environment variables.
- Alembic should be used whenever backend database models are changed.
- The default text, `Generic single-database configuration`, is created automatically by Alembic and can be replaced with this project-specific documentation.
