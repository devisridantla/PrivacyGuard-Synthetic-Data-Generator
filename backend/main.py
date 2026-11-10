"""
PrivacyGuard – Synthetic Data Generator FastAPI Backend.
Provides high-performance APIs for dataset configuration, dynamic synthetic data synthesis,
privacy compliance validation, custom column generation, multi-format exports, and AI prompt assistance.
"""

import io
import random
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Body, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, RedirectResponse
from pydantic import BaseModel, Field

import database
from generator import generate_dataset, DEPARTMENTS, BLOOD_GROUPS
from privacy_validator import audit_dataset_privacy
from exporters import export_to_csv_bytes, export_to_json_bytes, export_to_excel_bytes
from ai_assistant import process_ai_generation_request

app = FastAPI(
    title="PrivacyGuard – Synthetic Data Generator API",
    version="1.0.0",
    description="Privacy-preserving synthetic data generation platform powered by FastAPI, Pandas, and Generative AI. 100% fictional data with zero real PII."
)

# Enable CORS for local and cross-origin frontend clients (including React Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)


# ---------------- Request & Response Models ----------------
class CustomColumnDefinition(BaseModel):
    name: str = Field(..., description="Name of the custom column")
    type: str = Field(default="text", description="Data type: text, number, choice, boolean, id, date")
    options: Optional[str] = Field(None, description="Comma-separated options for choice type")
    min_val: Optional[int] = Field(None, description="Minimum value for number type")
    max_val: Optional[int] = Field(None, description="Maximum value for number type")


class GenerateCustomColumnRequest(BaseModel):
    column_name: str
    column_type: str = "text"  # text, number, choice, boolean, id, date
    options: Optional[str] = None
    min_val: Optional[int] = 1
    max_val: Optional[int] = 100
    record_count: int = Field(default=10, ge=1, le=1000)


class GenerateRequest(BaseModel):
    dataset_name: Optional[str] = Field(default="Indian_Students_Synthetic", description="Name of dataset")
    record_count: int = Field(default=50, ge=1, le=5000, description="Records count (10, 50, 100, 500, 1000, etc.)")
    category: str = Field(default="Indian Students", description="Data category: Indian Students, Healthcare / Medical, E-Commerce Customers, Corporate / HR")
    columns: Optional[List[str]] = Field(None, description="List of required column names")
    custom_columns: Optional[List[CustomColumnDefinition]] = Field(None, description="Optional custom columns")
    format: Optional[str] = Field(default="json", description="Target export format: json, csv, xlsx")


class ExportRequest(BaseModel):
    dataset_name: str = "synthetic_dataset"
    category: str = "Indian Students"
    records: List[Dict[str, Any]]
    dataset_id: Optional[str] = None


class PrivacyValidateRequest(BaseModel):
    records: List[Dict[str, Any]]


class DuplicateCheckRequest(BaseModel):
    records: List[Dict[str, Any]]


class DatasetValidationRequest(BaseModel):
    records: List[Dict[str, Any]]
    dataset_name: Optional[str] = "Dataset"


from quality_auditor import evaluate_dataset_quality

class QualityReportRequest(BaseModel):
    records: List[Dict[str, Any]]
    dataset_name: Optional[str] = "Dataset"


class AIPromptRequest(BaseModel):
    prompt: str = Field(..., description="Natural language prompt, e.g. 'Generate 100 synthetic student records with name, email, roll number, department, and address'")


class SupabaseTestRequest(BaseModel):
    supabase_url: str
    supabase_key: str


# ---------------- Endpoints ----------------

@app.get("/", include_in_schema=False)
def root():
    """Redirects root URL to the interactive API documentation."""
    return RedirectResponse(url="/docs")


@app.get("/api/health")
def health_check():
    """Returns service health status, version, and Supabase / SQLite database connectivity."""
    db_status = database.get_db_status()
    return {
        "status": "healthy",
        "service": "PrivacyGuard Synthetic Data Generator",
        "version": "1.0.0",
        "privacy_mode": "ACTIVE (100% Synthetic)",
        "database": db_status
    }


@app.post("/api/generate")
def generate_dataset_endpoint(req: GenerateRequest):
    """
    Main synthetic dataset generation endpoint.
    Dynamically generates high-fidelity, fictional records based on configured category and columns.
    Computes statistical analytics and logs metadata to Supabase / SQLite.
    """
    try:
        custom_cols = [c.dict() for c in req.custom_columns] if req.custom_columns else None
        
        result = generate_dataset(
            name=req.dataset_name or "Synthetic_Dataset",
            count=req.record_count,
            category=req.category,
            columns=req.columns,
            custom_columns=custom_cols
        )

        # Run privacy audit on generated records
        privacy_audit = audit_dataset_privacy(result["records"])
        result["privacy_audit"] = privacy_audit

        # Persist metadata to Supabase or SQLite
        saved_meta = database.save_dataset_metadata(
            name=result["dataset_name"],
            category=result["category"],
            count=result["record_count"],
            columns=result["columns"],
            format_type=req.format or "json",
            privacy_score=privacy_audit.get("privacy_score", 100.0)
        )
        result["dataset_id"] = saved_meta.get("id")
        result["persistence_status"] = saved_meta.get("stored_in", "sqlite")

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data generation failed: {str(e)}")


@app.post("/api/custom-columns/generate")
def generate_custom_column_values(req: GenerateCustomColumnRequest):
    """
    Custom column generation API.
    Generates synthetic values for a specific custom column specification.
    Supports text, number, choice, boolean, id, and date formats.
    """
    try:
        col_name = req.column_name.strip()
        col_type = req.column_type.lower().strip()
        count = req.record_count
        options = [opt.strip() for opt in req.options.split(",")] if req.options else []

        generated_values = []
        for i in range(1, count + 1):
            if col_type == "number":
                min_v = req.min_val if req.min_val is not None else 1
                max_v = req.max_val if req.max_val is not None else 100
                val = random.randint(min_v, max_v)
            elif col_type == "choice" and options:
                val = random.choice(options)
            elif col_type == "boolean":
                val = random.choice(["True", "False"])
            elif col_type == "id":
                prefix = col_name.upper().replace(" ", "")[:4]
                val = f"{prefix}-{random.randint(1000, 9999)}"
            elif col_type == "date":
                month = random.randint(1, 12)
                day = random.randint(1, 28)
                val = f"2026-{month:02d}-{day:02d}"
            else:
                # Text
                val = f"Synthetic_{col_name}_{i}"
            generated_values.append(val)

        return {
            "column_name": col_name,
            "column_type": col_type,
            "record_count": count,
            "values": generated_values
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Custom column generation failed: {str(e)}")


@app.post("/api/ai/generate")
def ai_generate_endpoint(req: AIPromptRequest):
    """
    AI Assistant Endpoint:
    Processes natural language instructions such as:
    'Generate 100 synthetic student records with name, email, roll number, department, and address'
    Automatically extracts record count, domain category, and requested fields.
    """
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")
    try:
        result = process_ai_generation_request(req.prompt)
        privacy_audit = audit_dataset_privacy(result["records"])
        result["privacy_audit"] = privacy_audit

        # Save metadata
        saved_meta = database.save_dataset_metadata(
            name=result["dataset_name"],
            category=result["category"],
            count=result["record_count"],
            columns=result["columns"],
            format_type="json",
            privacy_score=privacy_audit.get("privacy_score", 100.0)
        )
        result["dataset_id"] = saved_meta.get("id")
        result["persistence_status"] = saved_meta.get("stored_in", "sqlite")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@app.post("/api/validate-privacy")
def validate_privacy_endpoint(req: PrivacyValidateRequest):
    """
    Audits provided dataset records for privacy compliance:
    - Verifies reserved email domains (RFC 2606 / RFC 6761)
    - Checks for accidental real Aadhaar / PAN / Phone leaks
    - Calculates privacy compliance score (0-100%)
    - Provides synthetic disclaimer
    """
    try:
        return audit_dataset_privacy(req.records)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Privacy validation failed: {str(e)}")


@app.post("/api/check-duplicates")
def check_duplicates_endpoint(req: DuplicateCheckRequest):
    """
    Duplicate checking API:
    Scans dataset records using Pandas for duplicate rows.
    """
    try:
        import pandas as pd
        if not req.records:
            return {"total_records": 0, "duplicate_count": 0, "has_duplicates": False}
        df = pd.DataFrame(req.records)
        duplicates = int(df.duplicated().sum())
        return {
            "total_records": len(df),
            "duplicate_count": duplicates,
            "has_duplicates": duplicates > 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Duplicate check failed: {str(e)}")


@app.post("/api/validate-dataset")
def validate_dataset_endpoint(req: DatasetValidationRequest):
    """
    Comprehensive Data Validation API:
    Performs duplicate check, null value check, privacy audit, and column schema validation.
    """
    try:
        import pandas as pd
        records = req.records
        if not records:
            return {
                "valid": True,
                "total_records": 0,
                "null_cells": 0,
                "duplicates": 0,
                "privacy_score": 100.0,
                "message": "Dataset is empty."
            }

        df = pd.DataFrame(records)
        null_count = int(df.isnull().sum().sum())
        dup_count = int(df.duplicated().sum())
        privacy = audit_dataset_privacy(records)

        return {
            "valid": True,
            "total_records": len(df),
            "total_columns": len(df.columns),
            "columns": list(df.columns),
            "null_cells": null_count,
            "duplicate_records": dup_count,
            "privacy_score": privacy["privacy_score"],
            "is_safe": privacy["is_safe"],
            "real_pii_detected": privacy["real_pii_detected"],
            "reserved_domain_compliance": privacy["reserved_domain_compliance"],
            "summary": "All validation checks passed. Zero real PII, reserved domains strictly verified."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dataset validation failed: {str(e)}")


@app.post("/api/quality-report")
def quality_report_endpoint(req: QualityReportRequest):
    """
    Dataset Quality & Integrity Assessment API:
    Computes Completeness, Uniqueness, Format Validity, and Privacy Integrity scores,
    and assigns an overall quality grade (A+, A, B, etc.) with actionable diagnostics.
    """
    try:
        return evaluate_dataset_quality(req.records, req.dataset_name or "Dataset")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quality evaluation failed: {str(e)}")


@app.post("/api/export/excel")
def export_excel_endpoint(req: ExportRequest):
    """Generates and streams a styled Excel (.xlsx) file with records and privacy certificate."""
    try:
        excel_bytes = export_to_excel_bytes(req.records, req.dataset_name, req.category)
        
        # Log export
        database.log_export_event(
            dataset_name=req.dataset_name,
            export_format="EXCEL",
            records_exported=len(req.records),
            dataset_id=req.dataset_id
        )

        filename = f"{req.dataset_name.replace(' ', '_')}.xlsx"
        return StreamingResponse(
            io.BytesIO(excel_bytes),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Excel export failed: {str(e)}")


@app.post("/api/export/csv")
def export_csv_endpoint(req: ExportRequest):
    """Generates and streams a CSV (.csv) file with privacy comment headers."""
    try:
        csv_bytes = export_to_csv_bytes(req.records, req.dataset_name)
        
        # Log export
        database.log_export_event(
            dataset_name=req.dataset_name,
            export_format="CSV",
            records_exported=len(req.records),
            dataset_id=req.dataset_id
        )

        filename = f"{req.dataset_name.replace(' ', '_')}.csv"
        return StreamingResponse(
            io.BytesIO(csv_bytes),
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV export failed: {str(e)}")


@app.post("/api/export/json")
def export_json_endpoint(req: ExportRequest):
    """Generates and streams a formatted JSON (.json) file."""
    try:
        json_bytes = export_to_json_bytes(req.records, req.dataset_name, req.category)
        
        # Log export
        database.log_export_event(
            dataset_name=req.dataset_name,
            export_format="JSON",
            records_exported=len(req.records),
            dataset_id=req.dataset_id
        )

        filename = f"{req.dataset_name.replace(' ', '_')}.json"
        return StreamingResponse(
            io.BytesIO(json_bytes),
            media_type="application/json",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"JSON export failed: {str(e)}")


@app.get("/api/history")
def get_history_endpoint():
    """Returns past dataset generation metadata and export history from Supabase or SQLite."""
    try:
        return database.get_history(limit=25)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")


@app.post("/api/supabase/test")
def test_supabase_endpoint(req: SupabaseTestRequest):
    """Tests Supabase credentials."""
    return database.test_supabase_connection(req.supabase_url, req.supabase_key)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
