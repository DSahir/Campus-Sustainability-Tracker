FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend ./backend
COPY scripts ./scripts
COPY data/processed ./data/processed
COPY alembic ./alembic
COPY alembic.ini ./alembic.ini
COPY .env ./.env

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

