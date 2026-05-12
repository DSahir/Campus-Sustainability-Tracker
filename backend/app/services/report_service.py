from datetime import date
from pathlib import Path

from fpdf import FPDF
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.core.config import settings
from backend.app.core.database import SessionLocal
from backend.app.models import Report, ResourceReading, ResourceType


def build_report_filename(campus: str, report_date: date) -> str:
    campus_slug = campus.strip().replace(" ", "_").lower()
    return f"sustainability_report_{campus_slug}_{report_date.isoformat()}.pdf"


def generate_report_pdf(campus: str, report_date: date, generated_by: int | None = None) -> bytes:
    db = SessionLocal()

    energy = (
        db.query(func.sum(ResourceReading.value))
        .filter(ResourceReading.type == ResourceType.energy)
        .scalar()
    ) or 0

    water = (
        db.query(func.sum(ResourceReading.value))
        .filter(ResourceReading.type == ResourceType.water)
        .scalar()
    ) or 0

    co2 = (
        db.query(func.sum(ResourceReading.value))
        .filter(ResourceReading.type == ResourceType.co2)
        .scalar()
    ) or 0

    waste = (
        db.query(func.sum(ResourceReading.value))
        .filter(ResourceReading.type == ResourceType.waste)
        .scalar()
    ) or 0

    building_rows = (
        db.query(
            ResourceReading.building_id,
            ResourceReading.type,
            func.sum(ResourceReading.value).label("total")
        )
        .group_by(ResourceReading.building_id, ResourceReading.type)
        .all()
    )

    building_data = {}

    for row in building_rows:
        bid = row.building_id

        if bid not in building_data:
            building_data[bid] = {
                "energy": 0,
                "water": 0,
                "co2": 0
            }

        if row.type == ResourceType.energy:
            building_data[bid]["energy"] = float(row.total)
        elif row.type == ResourceType.water:
            building_data[bid]["water"] = float(row.total)
        elif row.type == ResourceType.co2:
            building_data[bid]["co2"] = float(row.total)

    pdf = FPDF(format="A4")
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 18)
    pdf.cell(0, 12, "Campus Sustainability Report", ln=True, align="C")

    pdf.set_font("Helvetica", size=11)
    pdf.ln(5)
    pdf.cell(0, 8, f"Campus: {campus}", ln=True)
    pdf.cell(0, 8, f"Generated Date: {report_date.isoformat()}", ln=True)

    pdf.ln(8)
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "Executive Summary", ln=True)

    pdf.set_font("Helvetica", size=11)
    pdf.multi_cell(
        0,
        7,
        "This report summarizes sustainability performance using real campus resource data including energy consumption, water usage, carbon emissions, and waste generation."
    )

    pdf.ln(5)
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "Key Metrics", ln=True)

    pdf.set_font("Helvetica", size=11)
    pdf.cell(0, 8, f"Total Energy Usage: {energy:,.2f}", ln=True)
    pdf.cell(0, 8, f"Total Water Usage: {water:,.2f}", ln=True)
    pdf.cell(0, 8, f"Total CO2 Emissions: {co2:,.2f}", ln=True)
    pdf.cell(0, 8, f"Total Waste Generated: {waste:,.2f}", ln=True)

    pdf.ln(6)
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "Building Comparison", ln=True)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(35, 8, "Building", 1)
    pdf.cell(50, 8, "Energy", 1)
    pdf.cell(50, 8, "Water", 1)
    pdf.cell(50, 8, "CO2", 1, ln=True)

    pdf.set_font("Helvetica", size=9)

    for bid, vals in building_data.items():
        pdf.cell(35, 8, f"Building {bid}", 1)
        pdf.cell(50, 8, f"{vals['energy']:.2f}", 1)
        pdf.cell(50, 8, f"{vals['water']:.2f}", 1)
        pdf.cell(50, 8, f"{vals['co2']:.2f}", 1, ln=True)

    pdf.ln(6)
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "Recommendations", ln=True)

    pdf.set_font("Helvetica", size=11)
    pdf.multi_cell(0, 7, "1. Optimize HVAC schedules to reduce unnecessary energy use.")
    pdf.multi_cell(0, 7, "2. Investigate after-hours electricity consumption.")
    pdf.multi_cell(0, 7, "3. Monitor water efficiency across buildings.")
    pdf.multi_cell(0, 7, "4. Strengthen waste diversion and recycling programs.")

    db.close()

    return pdf.output(dest="S").encode("latin-1")


def create_report_record(
    db: Session,
    campus: str,
    file_name: str,
    pdf_bytes: bytes | None = None,
    generated_by: int | None = None,
) -> Report:
    output_dir = Path(settings.report_output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    file_path = output_dir / file_name

    if pdf_bytes is not None:
        file_path.write_bytes(pdf_bytes)

    report = Report(
        generated_by=generated_by,
        file_path=str(file_path),
        campus=campus,
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report