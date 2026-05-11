import argparse
import sys
from pathlib import Path

import pandas as pd

# Add project root to Python path so backend imports work when running from scripts/
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT))




DATASET_FILE = Path("data/processed/sustainability_readings_subset.csv")


def load_real_data(reset: bool = False):
    from backend.app.core.database import SessionLocal, engine
    from backend.app.models import Base, Building, ResourceReading, ResourceType
    """
    Load processed sustainability dataset into PostgreSQL.

    Loads:
    - buildings table
    - resource_readings table

    If --reset is used, existing readings for the dataset buildings are removed first.
    """

    if not DATASET_FILE.exists():
        raise FileNotFoundError(f"Dataset file not found: {DATASET_FILE}")

    print(f"Reading dataset from {DATASET_FILE}...")
    df = pd.read_csv(DATASET_FILE)

    required_columns = {
        "timestamp",
        "building_id",
        "display_name",
        "campus",
        "resource_type",
        "value",
    }

    missing_columns = required_columns - set(df.columns)
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")

    df["timestamp"] = pd.to_datetime(df["timestamp"])

    dataset_building_ids = sorted(df["building_id"].unique().tolist())

    print("Creating tables if they do not exist...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        if reset:
            print("Reset flag enabled. Removing existing resource readings for dataset buildings...")
            db.query(ResourceReading).filter(
                ResourceReading.building_id.in_(dataset_building_ids)
            ).delete(synchronize_session=False)
            db.commit()

        print("Loading buildings...")

        building_df = (
            df[["building_id", "display_name", "campus"]]
            .drop_duplicates()
            .sort_values("building_id")
        )

        for _, row in building_df.iterrows():
            building_id = int(row["building_id"])
            display_name = row["display_name"]
            campus = row["campus"]

            building = db.query(Building).filter(Building.id == building_id).first()

            if building:
                building.name = display_name
                building.location = campus
            else:
                building = Building(
                    id=building_id,
                    name=display_name,
                    location=campus,
                )
                db.add(building)

        db.commit()

        print("Loading resource readings...")

        readings = []

        for _, row in df.iterrows():
            resource_type = ResourceType(row["resource_type"])

            readings.append(
                ResourceReading(
                    building_id=int(row["building_id"]),
                    type=resource_type,
                    value=float(row["value"]),
                    ts=row["timestamp"].to_pydatetime(),
                )
            )

        db.bulk_save_objects(readings)
        db.commit()

        print("Real dataset loaded successfully!")
        print(f"Buildings loaded/updated: {len(building_df)}")
        print(f"Resource readings inserted: {len(readings)}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Load processed real sustainability dataset.")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Remove existing readings for dataset buildings before loading.",
    )

    args = parser.parse_args()
    load_real_data(reset=args.reset)