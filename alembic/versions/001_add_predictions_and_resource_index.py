"""add predictions table and resource readings index

Revision ID: 001_schema_updates
Revises:
Create Date: 2026-05-11
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect
from sqlalchemy.dialects import postgresql


revision = "001_schema_updates"
down_revision = None
branch_labels = None
depends_on = None


resource_type_enum = postgresql.ENUM(
    "energy",
    "water",
    "waste",
    "co2",
    name="resourcetype",
    create_type=False,
)


def upgrade():
    bind = op.get_bind()
    inspector = inspect(bind)

    existing_tables = inspector.get_table_names()

    if "predictions" not in existing_tables:
        op.create_table(
            "predictions",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("building_id", sa.Integer(), sa.ForeignKey("buildings.id"), nullable=False),
            sa.Column("type", resource_type_enum, nullable=False),
            sa.Column("ts", sa.DateTime(), nullable=False),
            sa.Column("predicted_value", sa.Float(), nullable=False),
            sa.Column("lower", sa.Float(), nullable=True),
            sa.Column("upper", sa.Float(), nullable=True),
            sa.Column("model_version", sa.String(), nullable=False),
        )

    existing_indexes = [
        index["name"]
        for index in inspector.get_indexes("resource_readings")
    ]

    if "idx_resource_readings_building_type_ts" not in existing_indexes:
        op.create_index(
            "idx_resource_readings_building_type_ts",
            "resource_readings",
            ["building_id", "type", "ts"],
        )


def downgrade():
    bind = op.get_bind()
    inspector = inspect(bind)

    existing_indexes = [
        index["name"]
        for index in inspector.get_indexes("resource_readings")
    ]

    if "idx_resource_readings_building_type_ts" in existing_indexes:
        op.drop_index(
            "idx_resource_readings_building_type_ts",
            table_name="resource_readings",
        )

    existing_tables = inspector.get_table_names()

    if "predictions" in existing_tables:
        op.drop_table("predictions")