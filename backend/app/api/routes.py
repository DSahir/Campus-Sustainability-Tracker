from fastapi import APIRouter

from backend.app.api.endpoints import alerts, auth, buildings, metrics, predict, recommendations, reports, settings

router = APIRouter()
router.include_router(auth.router, tags=["auth"])
router.include_router(metrics.router, tags=["metrics"])
router.include_router(buildings.router, tags=["buildings"])
router.include_router(settings.router, tags=["settings"])
router.include_router(alerts.router, tags=["alerts"])
router.include_router(predict.router, tags=["predict"])
router.include_router(reports.router, tags=["reports"])
router.include_router(recommendations.router, tags=["recommendations"])
