from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from backend.app.core.config import settings
from backend.app.ml.anomaly import detect_anomaly
from backend.app.models import ResourceType


def _resolve_artifact_path(resource_type: ResourceType) -> Path:
    artifact_name = settings.model_artifact_map.get(resource_type.value)
    if not artifact_name:
        raise ValueError(f"No model artifact configured for {resource_type.value}")
    path = Path(settings.model_artifacts_dir) / artifact_name
    if not path.exists():
        raise FileNotFoundError(f"Model artifact not found: {path}")
    return path


class ModelArtifact:
    def __init__(self, model: object, source_path: Path, resource_type: ResourceType):
        self.model = model
        self.source_path = source_path
        self.resource_type = resource_type
        self.is_onnx = source_path.suffix.lower() == ".onnx"

        artifact_name = source_path.name.lower()
        if "xgboost" in artifact_name:
            self.model_status = "xgboost_live"
        elif "baseline" in artifact_name:
            self.model_status = f"{resource_type.value}_baseline"
        else:
            self.model_status = f"{resource_type.value}_model"

    def predict(self, features: dict[str, float]) -> float:
        values = pd.DataFrame([features])
        if self.is_onnx:
            session = self.model
            input_name = session.get_inputs()[0].name
            input_data = np.array(values.astype(np.float32), dtype=np.float32)
            result = session.run(None, {input_name: input_data})
            return float(result[0][0])
        return float(self.model.predict(values)[0])


class ModelArtifactLoader:
    @staticmethod
    def load_model(resource_type: ResourceType) -> ModelArtifact:
        artifact_path = _resolve_artifact_path(resource_type)
        if artifact_path.suffix.lower() == ".onnx":
            try:
                import onnxruntime as ort
            except ImportError as error:
                raise RuntimeError(
                    "onnxruntime is required to load ONNX models. "
                    "Install onnxruntime or use a joblib artifact."
                ) from error
            model = ort.InferenceSession(str(artifact_path))
        else:
            model = joblib.load(artifact_path)
        return ModelArtifact(model=model, source_path=artifact_path, resource_type=resource_type)

    @staticmethod
    def detect_anomaly(current_value: float, historical_values: list[float]) -> bool:
        return detect_anomaly(current_value=current_value, historical_values=historical_values)


def predict_resource_from_model(
    model: ModelArtifact,
    lag1: float,
    lag24: float,
    hour: int,
    dayofweek: int,
) -> float:
    features = {
        "lag1": lag1,
        "lag24": lag24,
        "hour": hour,
        "dayofweek": dayofweek,
    }
    return model.predict(features)
