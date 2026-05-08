import pandas as pd

def detect_anomaly(current_value, historical_values):
    series = pd.Series(historical_values)

    mean = series.mean()
    std = series.std()

    if std == 0:
        return False

    z_score = (current_value - mean) / std

    return abs(z_score) > 2.5