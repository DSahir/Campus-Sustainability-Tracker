import pandas as pd
from backend.app.core.database import SessionLocal
from backend.app.models import ResourceReading, ResourceType

df = pd.read_csv("/app/data/processed/sustainability_readings_subset.csv")

db = SessionLocal()

rows = []

for _, row in df.iterrows():
    try:
        rows.append(
            ResourceReading(
                building_id=int(row["building_id"]),
                type=ResourceType(row["resource_type"]),
                value=float(row["value"]),
                ts=pd.to_datetime(row["timestamp"]),
            )
        )
    except Exception as e:
        print("Skipped:", e)

db.bulk_save_objects(rows)
db.commit()

print("Imported", len(rows), "rows")