import joblib
import pandas as pd
from backend.app.ml.anomaly import detect_anomaly

MODEL_PATH = r"D:\CS\520\project\project\backend\app\ml\artifacts\xgboost_model.joblib"

model = joblib.load(MODEL_PATH)

def predict_energy(lag1, lag24, hour, dayofweek):
    input_data = pd.DataFrame([{
        "lag1": lag1,
        "lag24": lag24,
        "hour": hour,
        "dayofweek": dayofweek
    }])

    prediction = model.predict(input_data)[0]

    anomaly = detect_anomaly(
        current_value=prediction,
        historical_values=[lag1, lag24]
    )

    return float(prediction), bool(anomaly)