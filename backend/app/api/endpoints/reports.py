from datetime import date

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models import Report
from backend.app.services.report_service import (
    build_report_filename,
    create_report_record,
    generate_report_pdf,
)

router = APIRouter(prefix="/reports")


@router.get("")
def list_reports(db: Session = Depends(get_db)) -> dict:
    stmt = select(Report).order_by(Report.created_at.desc())
    rows = db.execute(stmt).scalars().all()
    items = [
        {
            "id": report.id,
            "campus": report.campus,
            "generated_on": report.created_at.date().isoformat(),
            "status": "available",
            "default_filename": report.file_path.rsplit("/", 1)[-1],
        }
        for report in rows
    ]
    return {"items": items}


@router.get("/download")
def download_report(
    campus: str = Query(default="north-campus"),
    filename: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> StreamingResponse:
    report_date = date.today()
    resolved_filename = filename or build_report_filename(campus, report_date)
    pdf_bytes = generate_report_pdf(campus=campus, report_date=report_date)
    create_report_record(
        db=db,
        campus=campus,
        file_name=resolved_filename,
        pdf_bytes=pdf_bytes,
    )
    headers = {"Content-Disposition": f'attachment; filename="{resolved_filename}"'}
    return StreamingResponse(iter([pdf_bytes]), media_type="application/pdf", headers=headers)
