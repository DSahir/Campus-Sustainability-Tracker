import pandas as pd
from pathlib import Path

ENERGY_FILE = Path("data/processed/bdg2_energy_subset.csv")
OUTPUT_FILE = Path("data/processed/co2_subset.csv")

# Approximate emissions factor:
# CO2 value = energy value * emission factor
# This keeps CO2 derived from real energy readings.
EMISSION_FACTOR = 0.0004

print("Reading processed energy dataset...")

energy_df = pd.read_csv(ENERGY_FILE)

print("Energy shape:", energy_df.shape)

co2_df = energy_df.copy()

# Keep original source traceability but change resource type
co2_df["resource_type"] = "co2"

# Derive CO2 values from energy readings
co2_df["value"] = co2_df["value"] * EMISSION_FACTOR

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
co2_df.to_csv(OUTPUT_FILE, index=False)

print("CO2 dataset created successfully!")
print("Output file:", OUTPUT_FILE)
print("Final shape:", co2_df.shape)
print("Date range:", co2_df["timestamp"].min(), "to", co2_df["timestamp"].max())
print("Buildings used:", co2_df["building_id"].nunique())
print("Resource types:", co2_df["resource_type"].unique())
print(co2_df.head())