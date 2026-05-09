import pandas as pd
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
import math

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = PROJECT_ROOT / "data" / "processed" / "bdg2_energy_subset.csv"

df = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully")

# Convert timestamp
df["timestamp"] = pd.to_datetime(df["timestamp"])

# Sort time-series
df = df.sort_values(["building_id", "timestamp"])

# Create lag features
df["lag1"] = df.groupby("building_id")["value"].shift(1)
df["lag24"] = df.groupby("building_id")["value"].shift(24)

# Time features
df["hour"] = df["timestamp"].dt.hour
df["dayofweek"] = df["timestamp"].dt.dayofweek

# Remove missing rows
df = df.dropna()

print("Rows after preprocessing:", len(df))

# Features + target
features = ["lag1", "lag24", "hour", "dayofweek"]

X = df[features]
y = df["value"]

# Train XGBoost model
model = XGBRegressor(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=6,
    random_state=42
)

model.fit(X, y)

print("XGBoost model trained successfully")

# Predictions
predictions = model.predict(X)

# Metrics
mae = mean_absolute_error(y, predictions)
rmse = math.sqrt(mean_squared_error(y, predictions))

print("MAE:", mae)
print("RMSE:", rmse)

# Save model
MODEL_SAVE_PATH = PROJECT_ROOT / "backend" / "app" / "ml" / "artifacts" / "xgboost_model.joblib"

joblib.dump(model, MODEL_SAVE_PATH)

print("Model saved at:", MODEL_SAVE_PATH)