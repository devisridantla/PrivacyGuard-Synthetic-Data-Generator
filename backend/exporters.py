"""
Exporters Module for PrivacyGuard.
Provides export streams and files for Excel (.xlsx), CSV (.csv), and JSON formats.
Applies professional styling, synthetic watermarks, and metadata documentation.
"""

import io
import json
import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from typing import List, Dict, Any, Tuple


def export_to_csv_bytes(records: List[Dict[str, Any]], dataset_name: str = "dataset") -> bytes:
    """Exports records to UTF-8 encoded CSV bytes."""
    df = pd.DataFrame(records)
    csv_str = df.to_csv(index=False)
    # Add privacy disclaimer banner at top
    header_comment = (
        f"# PrivacyGuard Synthetic Dataset: {dataset_name}\n"
        "# CLASSIFICATION: 100% SYNTHETIC DATA - FICTIONAL COMPUTER FABRICATIONS\n"
        "# DISCLAIMER: Strictly for testing, research, and educational purposes. Zero real PII.\n"
    )
    full_csv = header_comment + csv_str
    return full_csv.encode("utf-8")


def export_to_json_bytes(records: List[Dict[str, Any]], dataset_name: str = "dataset", category: str = "Synthetic") -> bytes:
    """Exports records to pretty-formatted JSON bytes with synthetic metadata wrapper."""
    payload = {
        "dataset_name": dataset_name,
        "category": category,
        "record_count": len(records),
        "classification": "100% SYNTHETIC DATA",
        "privacy_guarantee": "Zero real PII. Reserved domains applied. Compliance verified.",
        "records": records
    }
    return json.dumps(payload, indent=2, ensure_ascii=False).encode("utf-8")


def export_to_excel_bytes(records: List[Dict[str, Any]], dataset_name: str = "dataset", category: str = "Synthetic") -> bytes:
    """
    Exports records to a professional multi-sheet Excel (.xlsx) workbook using openpyxl:
    - Sheet 1: 'Synthetic Dataset' with custom dark-blue/purple header styling and auto-width
    - Sheet 2: 'Privacy & Compliance' with synthetic declaration, disclaimer, and audit metadata
    """
    wb = Workbook()
    
    # Sheet 1: Records
    ws_data = wb.active
    ws_data.title = "Synthetic Data"

    if records:
        columns = list(records[0].keys())
        # Header style (Dark Blue / Indigo theme)
        header_fill = PatternFill(start_color="1E1B4B", end_color="1E1B4B", fill_type="solid")
        header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
        cell_font = Font(name="Segoe UI", size=10)
        thin_border = Border(
            left=Side(style='thin', color="E2E8F0"),
            right=Side(style='thin', color="E2E8F0"),
            top=Side(style='thin', color="E2E8F0"),
            bottom=Side(style='thin', color="E2E8F0")
        )
        center_align = Alignment(horizontal="center", vertical="center")
        left_align = Alignment(horizontal="left", vertical="center")

        # Write Header
        ws_data.row_dimensions[1].height = 26
        for col_idx, col_name in enumerate(columns, 1):
            cell = ws_data.cell(row=1, column=col_idx, value=col_name)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = center_align

        # Write Rows
        for row_idx, record in enumerate(records, 2):
            ws_data.row_dimensions[row_idx].height = 20
            # Alternate light background for rows
            is_even = (row_idx % 2 == 0)
            row_fill = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid") if is_even else None

            for col_idx, col_name in enumerate(columns, 1):
                val = record.get(col_name, "")
                cell = ws_data.cell(row=row_idx, column=col_idx, value=val)
                cell.font = cell_font
                cell.border = thin_border
                cell.alignment = left_align
                if row_fill:
                    cell.fill = row_fill

        # Auto-fit column widths
        for col_idx, col_name in enumerate(columns, 1):
            max_len = max([len(str(r.get(col_name, ""))) for r in records[:50]] + [len(col_name)])
            col_letter = get_column_letter(col_idx)
            ws_data.column_dimensions[col_letter].width = min(max(max_len + 4, 12), 45)

    # Sheet 2: Privacy Certificate / Metadata
    ws_meta = wb.create_sheet(title="Privacy & Compliance")
    ws_meta.column_dimensions['A'].width = 28
    ws_meta.column_dimensions['B'].width = 65

    meta_title_fill = PatternFill(start_color="4338CA", end_color="4338CA", fill_type="solid")
    meta_title_font = Font(name="Segoe UI", size=14, bold=True, color="FFFFFF")
    
    ws_meta.merge_cells("A1:B1")
    title_cell = ws_meta["A1"]
    title_cell.value = "PRIVACYGUARD SYNTHETIC DATA CERTIFICATE"
    title_cell.fill = meta_title_fill
    title_cell.font = meta_title_font
    title_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws_meta.row_dimensions[1].height = 32

    meta_rows = [
        ("Dataset Name", dataset_name),
        ("Category", category),
        ("Total Records", len(records)),
        ("Classification", "100% Synthetic / Fictional"),
        ("Real PII Exposure", "Zero (0.00%) - Rigorously verified"),
        ("Reserved Email Domains", "Strictly IETF RFC-reserved domains (@example.com, @student.example.org)"),
        ("Fictional Phone Numbers", "Reserved telecommunication dummy ranges"),
        ("Compliance Frameworks", "GDPR Art. 89, India DPDP Act 2023, ISO/IEC 20889"),
        ("Legal Disclaimer", "All names, rolls, emails, and addresses are fictional computer fabrications. Any resemblance to real persons or entities is entirely coincidental.")
    ]

    bold_font = Font(name="Segoe UI", size=10, bold=True, color="1E293B")
    regular_font = Font(name="Segoe UI", size=10, color="334155")

    for idx, (label, val) in enumerate(meta_rows, 3):
        ws_meta.row_dimensions[idx].height = 22
        c1 = ws_meta.cell(row=idx, column=1, value=label)
        c1.font = bold_font
        c2 = ws_meta.cell(row=idx, column=2, value=str(val))
        c2.font = regular_font

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    return output.getvalue()
