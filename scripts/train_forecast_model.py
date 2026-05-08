import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
import joblib
import os

# Load dataset
df = pd.read_csv(r"D:\CS\520\project\project\data\processed\bdg2_energy_subset.csv")

print("Dataset loaded successfully")
print(df.head())

# Convert timestamp column
df["timestamp"] = pd.to_datetime(df["timestamp"])

# Sort values for time-series forecasting
df = df.sort_values(["building_id", "timestamp"])

# Create lag features
df["lag1"] = df.groupby("building_id")["value"].shift(1)
df["lag24"] = df.groupby("building_id")["value"].shift(24)

# Create time-based features
df["hour"] = df["timestamp"].dt.hour
df["dayofweek"] = df["timestamp"].dt.dayofweek

# Remove rows with missing lag values
df = df.dropna()

print("Rows after preprocessing:", len(df))

# Define features
features = ["lag1", "lag24", "hour", "dayofweek"]

X = df[features]
y = df["value"]

# Train baseline model
model = LinearRegression()
model.fit(X, y)

print("Baseline model trained successfully")

# Predict
predictions = model.predict(X)

# Evaluate
mae = mean_absolute_error(y, predictions)

print("MAE:", mae)

# Save model
save_path = r"D:\CS\520\project\project\backend\app\ml\artifacts\baseline_model.joblib"

joblib.dump(model, save_path)

print("Model saved at:", save_path)