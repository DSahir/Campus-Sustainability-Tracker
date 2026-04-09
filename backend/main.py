from fastapi import FastAPI
<<<<<<< HEAD
from auth import router as auth_router
=======
>>>>>>> upstream/main
from models import Base
from sqlalchemy import create_engine
import time

app = FastAPI()

<<<<<<< HEAD
# Include auth routes
app.include_router(auth_router)

DATABASE_URL = "postgresql://user:password@db:5432/sustainability"

# Retry DB connection
=======
DATABASE_URL = "postgresql://user:password@db:5432/sustainability"

# Retry connection
>>>>>>> upstream/main
for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        Base.metadata.create_all(bind=engine)
        print("Connected to DB")
        break
    except Exception as e:
        print("Waiting for DB...")
        time.sleep(3)

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}