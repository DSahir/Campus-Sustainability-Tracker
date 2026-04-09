from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_reports_list_returns_http_200() -> None:
    response = client.get("/api/v1/reports")
    assert response.status_code == 200


def test_reports_list_response_shape() -> None:
    response = client.get("/api/v1/reports")
    payload = response.json()

    assert isinstance(payload, dict)
    assert "items" in payload
    assert isinstance(payload["items"], list)
    assert {"id", "campus", "generated_on", "status", "default_filename"} <= payload["items"][0].keys()


def test_report_download_returns_pdf_stream() -> None:
    response = client.get("/api/v1/reports/download")

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.content.startswith(b"%PDF-1.4")

