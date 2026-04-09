from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_healthcheck() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_stub_endpoints_return_success() -> None:
    endpoints = [
        ("post", "/api/v1/auth/login"),
        ("get", "/api/v1/metrics/summary"),
        ("get", "/api/v1/buildings"),
        ("get", "/api/v1/settings/thresholds"),
        ("get", "/api/v1/alerts"),
        ("get", "/api/v1/predict"),
        ("get", "/api/v1/reports"),
        ("get", "/api/v1/recommendations"),
    ]

    for method, path in endpoints:
        response = getattr(client, method)(path)
        assert response.status_code == 200, path


def test_report_download_uses_default_filename() -> None:
    response = client.get("/api/v1/reports/download?campus=north-campus")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert "sustainability_report_north-campus_" in response.headers["content-disposition"]
    assert response.content.startswith(b"%PDF-1.4")


def test_report_download_allows_filename_override() -> None:
    response = client.get("/api/v1/reports/download?filename=custom_report.pdf")
    assert response.status_code == 200
    assert 'filename="custom_report.pdf"' in response.headers["content-disposition"]
