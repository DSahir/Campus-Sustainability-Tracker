from fastapi import APIRouter, HTTPException, Depends
from jose import jwt
from passlib.context import CryptContext
from fastapi.security import HTTPBearer

router = APIRouter()

SECRET_KEY = "secret123"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

fake_user = {
    "username": "admin",
    "password": pwd_context.hash("1234"),
    "role": "admin"
}

@router.post("/auth/login")
def login(data: dict):
    if data["username"] != fake_user["username"]:
        raise HTTPException(status_code=401)

    if not pwd_context.verify(data["password"], fake_user["password"]):
        raise HTTPException(status_code=401)

    token = jwt.encode(
        {"sub": data["username"], "role": fake_user["role"]},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": fake_user["role"]
    }

def get_current_user(token=Depends(security)):
    payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    return payload

def require_role(roles: list):
    def checker(user=Depends(get_current_user)):
        if user["role"] not in roles:
            raise HTTPException(status_code=403)
        return user
    return checker

@router.get("/protected")
def protected(user=Depends(require_role(["admin"]))):
    return {"message": "You are allowed"}