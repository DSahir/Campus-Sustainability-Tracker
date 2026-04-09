from datetime import date

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse

from backend.app.services.report_service import build_report_filename, generate_stub_pdf

router = APIRouter(prefix="/reports")


@router.get("")
def list_reports() -> dict:
    return {
        "items": [
            {
                "id": "REP-2026-04-09",
                "campus": "north-campus",
                "generated_on": "2026-04-09",
                "status": "available",
                "default_filename": build_report_filename("north-campus", date(2026, 4, 9)),
            }
        ]
    }


@router.get("/download")
def download_report(
    campus: str = Query(default="north-campus"),
    filename: str | None = Query(default=None),
) -> StreamingResponse:
    report_date = date.today()
    resolved_filename = filename or build_report_filename(campus, report_date)
    pdf_bytes = generate_stub_pdf(campus=campus, report_date=report_date)
    headers = {"Content-Disposition": f'attachment; filename="{resolved_filename}"'}
    return StreamingResponse(iter([pdf_bytes]), media_type="application/pdf", headers=headers)
