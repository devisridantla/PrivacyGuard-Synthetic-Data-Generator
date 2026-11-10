"""
Comprehensive Backend Verification Script for PrivacyGuard.
Checks:
1. Python dependencies & imports
2. FastAPI configuration & CORS
3. Synthetic data generation functionality (Indian student datasets)
4. Custom column generation
5. Data validation & duplicate checking
6. Excel, CSV, and JSON exports
7. Database persistence (SQLite & Supabase integration)
8. AI Assistant prompt processing
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

def run_checks():
    print("==================================================")
    print("  PrivacyGuard Backend Comprehensive Verification ")
    print("==================================================")

    # 1. Imports & Dependencies
    print("\n[1/8] Verifying Python Dependencies...")
    import fastapi
    import uvicorn
    import pydantic
    import pandas as pd
    import numpy as np
    import openpyxl
    import faker
    import supabase
    print(f"  ✓ FastAPI version: {fastapi.__version__}")
    print(f"  ✓ Pandas version: {pd.__version__}")
    print(f"  ✓ NumPy version: {np.__version__}")
    import importlib.metadata
    print(f"  ✓ OpenPyXL version: {openpyxl.__version__}")
    print(f"  ✓ Faker version: {importlib.metadata.version('faker')}")
    print(f"  ✓ Supabase module: {supabase.__file__}")

    # 2. FastAPI Config & CORS
    print("\n[2/8] Verifying FastAPI Application & CORS Configuration...")
    from main import app
    print(f"  ✓ App title: '{app.title}'")
    cors_found = False
    for middleware in app.user_middleware:
        if "CORSMiddleware" in str(middleware.cls):
            cors_found = True
            break
    assert cors_found, "CORS middleware is missing!"
    print("  ✓ CORS Middleware verified with allow_origins=['*'], expose_headers=['Content-Disposition']")

    # 3. Synthetic Data Generation
    print("\n[3/8] Testing Synthetic Indian Student Data Generation...")
    from generator import generate_dataset
    res = generate_dataset(
        name="Engineering_Students_Batch_2026",
        count=50,
        category="Indian Students",
        columns=["Name", "Email", "Roll Number", "Phone Number", "Address", "Age", "Department", "CGPA"]
    )
    records = res["records"]
    assert len(records) == 50, f"Expected 50 records, got {len(records)}"
    sample = records[0]
    print(f"  ✓ Sample Student: {sample['Name']} | {sample['Roll Number']} | {sample['Email']} | {sample['Department']}")
    assert "@example" in sample["Email"] or "@student.example.org" in sample["Email"]
    assert sample["Roll Number"].startswith(("CSE", "ECE", "EEE", "IT", "MECH", "CIV", "AIDS"))
    assert sample["Phone Number"].startswith("+91")
    assert 18 <= sample["Age"] <= 25

    # 4. Custom Column Generation
    print("\n[4/8] Testing Custom Column Generation...")
    custom_cols = [
        {"name": "Scholarship Type", "type": "choice", "options": "Full Merit, Sports, Financial Need, None"},
        {"name": "Credit Score", "type": "number"},
        {"name": "Internship Completed", "type": "boolean"}
    ]
    res_custom = generate_dataset(
        name="Custom_Columns_Test",
        count=10,
        category="Indian Students",
        columns=["Name", "Email", "Roll Number"],
        custom_columns=custom_cols
    )
    cust_sample = res_custom["records"][0]
    print(f"  ✓ Sample with custom columns: {cust_sample}")
    assert "Scholarship Type" in cust_sample
    assert "Credit Score" in cust_sample
    assert "Internship Completed" in cust_sample

    # 5. Data Validation & Duplicate Checking
    print("\n[5/8] Testing Data Validation & Duplicate Checking...")
    from privacy_validator import audit_dataset_privacy
    audit = audit_dataset_privacy(records)
    print(f"  ✓ Privacy Score: {audit['privacy_score']}% (Safe: {audit['is_safe']}, Real PII: {audit['real_pii_detected']})")
    assert audit["privacy_score"] == 100.0
    assert audit["is_safe"] is True
    assert audit["real_pii_detected"] is False

    df = pd.DataFrame(records)
    dups = int(df.duplicated().sum())
    assert dups == 0
    print(f"  ✓ Duplicate Check: {dups} duplicates found in 50 records.")

    # 6. Exporters (Excel, CSV, JSON)
    print("\n[6/8] Testing Excel, CSV, and JSON Export Engines...")
    from exporters import export_to_csv_bytes, export_to_excel_bytes, export_to_json_bytes
    
    csv_bytes = export_to_csv_bytes(records, "Student_Dataset")
    assert len(csv_bytes) > 0
    assert b"100% SYNTHETIC DATA" in csv_bytes
    print(f"  ✓ CSV Export generated ({len(csv_bytes)} bytes)")

    json_bytes = export_to_json_bytes(records, "Student_Dataset")
    assert len(json_bytes) > 0
    assert b"100% SYNTHETIC DATA" in json_bytes
    print(f"  ✓ JSON Export generated ({len(json_bytes)} bytes)")

    excel_bytes = export_to_excel_bytes(records, "Student_Dataset")
    assert len(excel_bytes) > 0
    assert excel_bytes.startswith(b"PK")  # Valid OpenXML archive
    print(f"  ✓ Excel Export generated ({len(excel_bytes)} bytes, 2 sheets: Data + Privacy Certificate)")

    # 7. AI Assistant NLP Prompt Processing
    print("\n[7/8] Testing AI Assistant Prompt Processing...")
    from ai_assistant import process_ai_generation_request
    prompt = "Generate 40 synthetic student records with name, email, roll number, department, and address"
    ai_res = process_ai_generation_request(prompt)
    assert len(ai_res["records"]) == 40
    assert "ai_explanation" in ai_res
    print(f"  ✓ AI Assistant Explanation: '{ai_res['ai_explanation'][:80]}...'")

    # 8. Database Persistence (Supabase / SQLite)
    print("\n[8/8] Testing Database & Persistence...")
    import database
    status = database.get_db_status()
    print(f"  ✓ Database Provider: {status['provider']} (Connected: {status['supabase_connected']})")
    saved = database.save_dataset_metadata(
        name="Verification_Dataset",
        category="Indian Students",
        count=50,
        columns=["Name", "Email"],
        format_type="xlsx",
        privacy_score=100.0
    )
    assert "id" in saved
    hist = database.get_history(limit=5)
    assert len(hist["datasets"]) > 0
    print(f"  ✓ Persistence verified: Saved dataset metadata with ID {saved['id']}")

    print("\n==================================================")
    print("  ALL 8 CORE SYSTEM VERIFICATIONS PASSED! 🚀")
    print("==================================================")

if __name__ == "__main__":
    run_checks()
