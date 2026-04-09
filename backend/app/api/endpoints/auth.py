from fastapi import APIRouter

router = APIRouter(prefix="/auth")


@router.post("/login")
def login() -> dict:
    return {
        "message": "Authentication stub response",
        "user": {
            "id": 1,
            "name": "Alex Johnson",
            "role": "administrator",
        },
        "token": "stub-jwt-token",
    }

