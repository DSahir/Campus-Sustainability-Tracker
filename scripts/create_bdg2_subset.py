import pandas as pd
from pathlib import Path

RAW_FILE = Path("data/raw/bdg2/electricity_cleaned.csv")
MAPPING_FILE = Path("data/processed/building_name_mapping.csv")
OUTPUT_FILE = Path("data/processed/bdg2_energy_subset.csv")

NUM_BUILDINGS = 5
NUM_ROWS = 24 * 30  # 30 days of hourly data

print("Reading BDG2 electricity data...")

df = pd.read_csv(RAW_FILE, nrows=NUM_ROWS)

print("Original shape:", df.shape)

timestamp_col = df.columns[0]

# Count non-missing values for each building column
building_value_counts = df.drop(columns=[timestamp_col]).notna().sum()

# Select buildings with the most available readings
building_cols = building_value_counts.sort_values(ascending=False).head(NUM_BUILDINGS).index.tolist()

print("Selected buildings:")
print(building_cols)

subset = df[[timestamp_col] + building_cols]

# Convert wide format to long format
long_df = subset.melt(
    id_vars=[timestamp_col],
    var_name="bdg2_building_name",
    value_name="value"
)

# Rename timestamp column
long_df = long_df.rename(columns={timestamp_col: "timestamp"})

# Add resource type
long_df["resource_type"] = "energy"

# Drop missing values
long_df = long_df.dropna()

# Load building display-name mapping
mapping_df = pd.read_csv(MAPPING_FILE)

# Add numeric building_id, display_name, building_type, and campus
long_df = long_df.merge(mapping_df, on="bdg2_building_name", how="left")

# Safety check: make sure every selected BDG2 building has a mapping
if long_df["display_name"].isna().any():
    missing_buildings = long_df[long_df["display_name"].isna()]["bdg2_building_name"].unique()
    raise ValueError(f"Missing building mappings for: {missing_buildings}")

# Reorder columns
long_df = long_df[
    [
        "timestamp",
        "building_id",
        "bdg2_building_name",
        "display_name",
        "building_type",
        "campus",
        "resource_type",
        "value",
    ]
]

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
long_df.to_csv(OUTPUT_FILE, index=False)

print("Processed dataset created successfully!")
print("Output file:", OUTPUT_FILE)
print("Final shape:", long_df.shape)
print("Date range:", long_df["timestamp"].min(), "to", long_df["timestamp"].max())
print("Buildings used:", long_df["building_id"].nunique())
print("Display names:")
print(long_df["display_name"].unique())
print(long_df.head())