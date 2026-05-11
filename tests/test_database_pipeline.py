from pathlib import Path

from backend.app.models import Prediction, ResourceReading


def test_prediction_model_exists():
    assert Prediction.__tablename__ == "predictions"

    column_names = Prediction.__table__.columns.keys()

    assert "building_id" in column_names
    assert "type" in column_names
    assert "ts" in column_names
    assert "predicted_value" in column_names
    assert "lower" in column_names
    assert "upper" in column_names
    assert "model_version" in column_names


def test_resource_readings_index_defined():
    index_names = {index.name for index in ResourceReading.__table__.indexes}

    assert "idx_resource_readings_building_type_ts" in index_names


def test_real_data_loader_script_exists():
    loader_path = Path("scripts/load_real_data.py")

    assert loader_path.exists()


def test_schema_migration_exists():
    migration_path = Path(
        "alembic/versions/001_add_predictions_and_resource_index.py"
    )

    assert migration_path.exists()