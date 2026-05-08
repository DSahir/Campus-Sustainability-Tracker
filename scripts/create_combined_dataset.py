import pandas as pd
from pathlib import Path

ENERGY_FILE = Path("data/processed/bdg2_energy_subset.csv")
WATER_FILE = Path("data/processed/bdg2_water_subset.csv")
CO2_FILE = Path("data/processed/co2_subset.csv")
WASTE_FILE = Path("data/processed/waste_time_series_subset.csv")
OUTPUT_FILE = Path("data/processed/sustainability_readings_subset.csv")

print("Reading processed energy dataset...")
energy_df = pd.read_csv(ENERGY_FILE)

print("Reading processed water dataset...")
water_df = pd.read_csv(WATER_FILE)

print("Reading processed CO2 dataset...")
co2_df = pd.read_csv(CO2_FILE)

print("Reading processed waste time-series dataset...")
waste_df = pd.read_csv(WASTE_FILE)

print("Energy shape:", energy_df.shape)
print("Water shape:", water_df.shape)
print("CO2 shape:", co2_df.shape)
print("Waste shape:", waste_df.shape)

# Combine all resource readings
combined_df = pd.concat(
    [energy_df, water_df, co2_df, waste_df],
    ignore_index=True
)

expected_columns = [
    "timestamp",
    "building_id",
    "bdg2_building_name",
    "display_name",
    "building_type",
    "campus",
    "resource_type",
    "value",
]

missing_columns = [col for col in expected_columns if col not in combined_df.columns]
if missing_columns:
    raise ValueError(f"Missing columns in combined dataset: {missing_columns}")

combined_df = combined_df.dropna()

combined_df = combined_df.sort_values(
    by=["building_id", "resource_type", "timestamp"]
)

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
combined_df.to_csv(OUTPUT_FILE, index=False)

print("Combined sustainability dataset created successfully!")
print("Output file:", OUTPUT_FILE)
print("Final shape:", combined_df.shape)
print("Resource types:", combined_df["resource_type"].unique())
print("Buildings used:", combined_df["building_id"].nunique())
print("Date range:", combined_df["timestamp"].min(), "to", combined_df["timestamp"].max())
print(combined_df.head())