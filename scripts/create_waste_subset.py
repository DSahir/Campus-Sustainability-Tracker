import pandas as pd
from pathlib import Path

ENERGY_FILE = Path("data/processed/bdg2_energy_subset.csv")

TIME_SERIES_OUTPUT = Path("data/processed/waste_time_series_subset.csv")
BREAKDOWN_OUTPUT = Path("data/processed/waste_breakdown_subset.csv")

print("Reading processed energy dataset...")

energy_df = pd.read_csv(ENERGY_FILE)

print("Energy shape:", energy_df.shape)

# -----------------------------
# 1. Create timestamp-level waste proxy
# -----------------------------
waste_df = energy_df.copy()

# Waste is a proxy because BDG2 does not provide building-level waste meter data
waste_df["resource_type"] = "waste"

# Estimate waste from energy activity using building-type factors
waste_factors = {
    "research": 0.08,
    "science": 0.07,
    "chemistry_lab": 0.09,
    "interdisciplinary_science": 0.075,
    "recreation": 0.06,
}

waste_df["value"] = waste_df.apply(
    lambda row: row["value"] * waste_factors.get(row["building_type"], 0.07),
    axis=1
)

TIME_SERIES_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
waste_df.to_csv(TIME_SERIES_OUTPUT, index=False)

print("Waste time-series proxy dataset created successfully!")
print("Time-series output file:", TIME_SERIES_OUTPUT)
print("Time-series shape:", waste_df.shape)

# -----------------------------
# 2. Create category-level waste breakdown
# -----------------------------
building_waste = (
    waste_df
    .groupby(["building_id", "display_name", "building_type", "campus"], as_index=False)["value"]
    .sum()
)

category_percentages = {
    "Recyclable": 0.38,
    "Organic": 0.27,
    "Landfill": 0.20,
    "Compost": 0.10,
    "Hazardous": 0.05,
}

rows = []

for _, row in building_waste.iterrows():
    for category, percentage in category_percentages.items():
        rows.append({
            "building_id": row["building_id"],
            "display_name": row["display_name"],
            "building_type": row["building_type"],
            "campus": row["campus"],
            "waste_category": category,
            "value": round(row["value"] * percentage, 4),
        })

breakdown_df = pd.DataFrame(rows)

breakdown_df.to_csv(BREAKDOWN_OUTPUT, index=False)

print("Waste breakdown dataset created successfully!")
print("Breakdown output file:", BREAKDOWN_OUTPUT)
print("Breakdown shape:", breakdown_df.shape)
print("Buildings used:", breakdown_df["building_id"].nunique())
print("Waste categories:", breakdown_df["waste_category"].unique())
print(breakdown_df.head())