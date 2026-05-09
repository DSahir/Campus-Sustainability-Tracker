import pandas as pd
from pathlib import Path

RAW_FILE = Path("data/raw/bdg2/water_cleaned.csv")

NUM_BUILDINGS = 5
NUM_ROWS = 24 * 30  # 30 days hourly

print("Reading BDG2 water data...")

df = pd.read_csv(RAW_FILE, nrows=NUM_ROWS)

print("Original shape:", df.shape)

timestamp_col = df.columns[0]

building_value_counts = df.drop(columns=[timestamp_col]).notna().sum()

selected_buildings = building_value_counts.sort_values(ascending=False).head(NUM_BUILDINGS)

print("Selected water buildings:")
print(selected_buildings)

print("\nColumn names selected:")
print(selected_buildings.index.tolist())