from datetime import date


def build_report_filename(campus: str, report_date: date) -> str:
    campus_slug = campus.strip().replace(" ", "_").lower()
    return f"sustainability_report_{campus_slug}_{report_date.isoformat()}.pdf"


def generate_stub_pdf(campus: str, report_date: date) -> bytes:
    body = (
        "%PDF-1.4\n"
        "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
        "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n"
        "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << >> >> endobj\n"
        "4 0 obj << /Length 79 >> stream\n"
        f"BT /F1 12 Tf 20 100 Td (Campus: {campus}) Tj 0 -18 Td (Date: {report_date.isoformat()}) Tj ET\n"
        "endstream endobj\n"
        "xref\n"
        "0 5\n"
        "0000000000 65535 f \n"
        "0000000010 00000 n \n"
        "0000000063 00000 n \n"
        "0000000122 00000 n \n"
        "0000000226 00000 n \n"
        "trailer << /Root 1 0 R /Size 5 >>\n"
        "startxref\n"
        "357\n"
        "%%EOF\n"
    )
    return body.encode("utf-8")

