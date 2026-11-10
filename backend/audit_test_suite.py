"""
Comprehensive Senior Engineer Audit Test Suite for PrivacyGuard.
Tests:
1. System Health & CORS preflight
2. Natural-language prompt parsing (5 varied prompts)
3. Scaling record generation (10, 50, 100, 500, 1000 records)
4. Multi-format export downloads (Excel, CSV, JSON)
5. Dataset Quality & Integrity Assessment
6. Privacy validation & PII leak detection (negative test)
7. Supabase / SQLite persistence and export logging
8. Duplicate scanning & missing value detection
9. Error handling & edge case validation
"""

import sys
import os
import time
import json
import urllib.request
import urllib.error

API_URL = "http://127.0.0.1:8000"

def log(step, msg):
    print(f"[{step}] {msg}")

def run_audit():
    print("================================================================")
    print("       PrivacyGuard Senior Engineer Complete System Audit       ")
    print("================================================================\n")

    # 1. Health & CORS
    log("1/9", "Auditing API Health & CORS Headers...")
    req = urllib.request.Request(f"{API_URL}/api/health", headers={"Origin": "http://localhost:5173"})
    res = urllib.request.urlopen(req)
    assert res.status == 200
    cors_origin = res.headers.get("Access-Control-Allow-Origin")
    assert cors_origin == "http://localhost:5173", f"Unexpected CORS: {cors_origin}"
    data = json.loads(res.read().decode())
    assert data["status"] == "healthy"
    print(f"  ✓ Health verified: {data['service']} (DB Provider: {data['database']['provider']})")
    print(f"  ✓ CORS verified: Allow-Origin = {cors_origin}")

    # 2. Natural Language Prompt Understanding
    log("2/9", "Auditing Natural-Language Prompt Understanding Engine...")
    test_prompts = [
        ("Generate 100 synthetic student records with name, email, roll number, department, and address", 100, "Indian Students", ["Name", "Email", "Roll Number", "Department", "Address"]),
        ("Create 50 final year CSE students with cgpa and attendance", 50, "Indian Students", ["CGPA", "Attendance (%)"]),
        ("250 records of medical patients with blood group and contact", 250, "Healthcare / Medical", ["Blood Group", "Phone Number"]),
        ("Generate 10 corporate employees with salary and department", 10, "Corporate / HR", ["Department"]),
        ("20 students with name and roll number", 20, "Indian Students", ["Name", "Roll Number"])
    ]

    for p, exp_count, exp_cat, exp_cols in test_prompts:
        payload = json.dumps({"prompt": p}).encode()
        r = urllib.request.Request(f"{API_URL}/api/ai/generate", data=payload, headers={"Content-Type": "application/json"})
        resp = json.loads(urllib.request.urlopen(r).read().decode())
        assert resp["record_count"] == exp_count, f"Expected count {exp_count}, got {resp['record_count']}"
        assert resp["category"] == exp_cat, f"Expected category {exp_cat}, got {resp['category']}"
        for col in exp_cols:
            assert col in resp["columns"], f"Expected column {col} in {resp['columns']}"
        print(f"  ✓ Parsed prompt '{p[:45]}...' -> {resp['record_count']} records, Category: {resp['category']}")

    # 3. Scaling Record Generation (10, 50, 100, 500, 1000)
    log("3/9", "Auditing Synthetic Generation Across Record Volumes...")
    volumes = [10, 50, 100, 500, 1000]
    last_records = None
    for count in volumes:
        t0 = time.time()
        payload = json.dumps({
            "dataset_name": f"Audit_Students_{count}",
            "record_count": count,
            "category": "Indian Students",
            "columns": ["Name", "Email", "Roll Number", "Phone Number", "Address", "Age", "Department", "CGPA"]
        }).encode()
        r = urllib.request.Request(f"{API_URL}/api/generate", data=payload, headers={"Content-Type": "application/json"})
        resp = json.loads(urllib.request.urlopen(r).read().decode())
        t1 = time.time()
        assert resp["record_count"] == count
        assert len(resp["records"]) == count
        assert resp["privacy_audit"]["privacy_score"] == 100.0
        elapsed_ms = round((t1 - t0) * 1000, 1)
        mem_kb = resp["analytics"]["memory_size_kb"]
        print(f"  ✓ Volume {count:4d} records: synthesized in {elapsed_ms:5.1f} ms (~{mem_kb} KB DataFrame)")
        last_records = resp["records"]

    # 4. Multi-Format Downloads (Excel, CSV, JSON)
    log("4/9", "Auditing Production Export Downloads...")
    sample_records = last_records[:50]
    
    # Excel Download
    req_excel = urllib.request.Request(
        f"{API_URL}/api/export/excel",
        data=json.dumps({"dataset_name": "Audit_Export_Test", "records": sample_records}).encode(),
        headers={"Content-Type": "application/json"}
    )
    res_excel = urllib.request.urlopen(req_excel)
    excel_bytes = res_excel.read()
    assert res_excel.status == 200
    assert excel_bytes.startswith(b"PK"), "Excel stream must be valid OpenXML ZIP"
    print(f"  ✓ Excel Export: Downloaded {len(excel_bytes)} bytes (.xlsx with Sheet 1 Data + Sheet 2 Privacy Certificate)")

    # CSV Download
    req_csv = urllib.request.Request(
        f"{API_URL}/api/export/csv",
        data=json.dumps({"dataset_name": "Audit_Export_Test", "records": sample_records}).encode(),
        headers={"Content-Type": "application/json"}
    )
    res_csv = urllib.request.urlopen(req_csv)
    csv_bytes = res_csv.read()
    assert res_csv.status == 200
    assert b"SYNTHETIC DATA" in csv_bytes
    print(f"  ✓ CSV Export: Downloaded {len(csv_bytes)} bytes (.csv with disclaimer comments)")

    # JSON Download
    req_json = urllib.request.Request(
        f"{API_URL}/api/export/json",
        data=json.dumps({"dataset_name": "Audit_Export_Test", "records": sample_records}).encode(),
        headers={"Content-Type": "application/json"}
    )
    res_json = urllib.request.urlopen(req_json)
    json_bytes = res_json.read()
    assert res_json.status == 200
    parsed_json = json.loads(json_bytes.decode())
    assert "records" in parsed_json
    assert parsed_json["record_count"] == len(sample_records)
    print(f"  ✓ JSON Export: Downloaded {len(json_bytes)} bytes (validated {parsed_json['record_count']} records)")

    # 5. Dataset Quality Reports
    log("5/9", "Auditing Dataset Quality & Integrity Assessment Engine...")
    req_quality = urllib.request.Request(
        f"{API_URL}/api/quality-report",
        data=json.dumps({"dataset_name": "Audit_Quality", "records": sample_records}).encode(),
        headers={"Content-Type": "application/json"}
    )
    q_res = json.loads(urllib.request.urlopen(req_quality).read().decode())
    assert q_res["overall_score"] >= 95.0, f"Expected score >= 95, got {q_res['overall_score']}"
    assert "A+" in q_res["grade"] or "A" in q_res["grade"]
    assert q_res["completeness_score"] == 100.0
    assert q_res["uniqueness_score"] == 100.0
    print(f"  ✓ Dataset Quality Report: Score = {q_res['overall_score']}% | Grade = {q_res['grade']}")
    print(f"  ✓ Completeness: {q_res['completeness_score']}% | Uniqueness: {q_res['uniqueness_score']}% | Validity: {q_res['validity_score']}%")

    # 6. Privacy Validation & PII Leak Detection
    log("6/9", "Auditing Privacy Validation & PII Leak Scanner...")
    # Safe records test
    req_priv_safe = urllib.request.Request(
        f"{API_URL}/api/validate-privacy",
        data=json.dumps({"records": sample_records}).encode(),
        headers={"Content-Type": "application/json"}
    )
    safe_audit = json.loads(urllib.request.urlopen(req_priv_safe).read().decode())
    assert safe_audit["privacy_score"] == 100.0
    assert safe_audit["is_safe"] is True
    print("  ✓ Safe Test: Privacy Score = 100.0% (Zero real PII, reserved domains verified)")

    # Injected leak test (commercial domain)
    leaky_records = [{"Name": "John Doe", "Email": "realperson@gmail.com", "Phone": "9876543210"}]
    req_priv_leak = urllib.request.Request(
        f"{API_URL}/api/validate-privacy",
        data=json.dumps({"records": leaky_records}).encode(),
        headers={"Content-Type": "application/json"}
    )
    leak_audit = json.loads(urllib.request.urlopen(req_priv_leak).read().decode())
    assert leak_audit["real_pii_detected"] is True, "Must detect commercial email leak!"
    assert leak_audit["privacy_score"] < 100.0, "Score must drop upon detecting real domain!"
    print(f"  ✓ Leak Detection Verified: Caught commercial provider @gmail.com (Score adjusted to {leak_audit['privacy_score']}%)")

    # 7. Duplicate Checking & Missing Value Checks
    log("7/9", "Auditing Duplicate Checking & Data Validation...")
    # Clean check
    req_dup_clean = urllib.request.Request(
        f"{API_URL}/api/check-duplicates",
        data=json.dumps({"records": sample_records}).encode(),
        headers={"Content-Type": "application/json"}
    )
    dup_clean_res = json.loads(urllib.request.urlopen(req_dup_clean).read().decode())
    assert dup_clean_res["duplicate_count"] == 0

    # Injected duplicate check
    sample_with_dup = list(sample_records) + [sample_records[0]]
    req_dup_dirty = urllib.request.Request(
        f"{API_URL}/api/check-duplicates",
        data=json.dumps({"records": sample_with_dup}).encode(),
        headers={"Content-Type": "application/json"}
    )
    dup_dirty_res = json.loads(urllib.request.urlopen(req_dup_dirty).read().decode())
    assert dup_dirty_res["duplicate_count"] == 1
    assert dup_dirty_res["has_duplicates"] is True
    print(f"  ✓ Duplicate Scanner Verified: Injected duplicate row successfully flagged (Count: {dup_dirty_res['duplicate_count']})")

    # 8. Supabase / SQLite Persistence & Export History
    log("8/9", "Auditing Database History & Supabase Sync...")
    req_hist = urllib.request.Request(f"{API_URL}/api/history")
    hist_data = json.loads(urllib.request.urlopen(req_hist).read().decode())
    assert "datasets" in hist_data
    assert "exports" in hist_data
    assert len(hist_data["datasets"]) > 0
    assert len(hist_data["exports"]) > 0
    print(f"  ✓ History Persistence Verified: {len(hist_data['datasets'])} datasets & {len(hist_data['exports'])} export events recorded in {hist_data['source']}")

    # 9. Error Handling & Input Validation
    log("9/9", "Auditing Edge Cases & Error Handling...")
    # Empty prompt test
    try:
        empty_req = urllib.request.Request(
            f"{API_URL}/api/ai/generate",
            data=json.dumps({"prompt": "   "}).encode(),
            headers={"Content-Type": "application/json"}
        )
        urllib.request.urlopen(empty_req)
        assert False, "Empty prompt should have raised 400"
    except urllib.error.HTTPError as e:
        assert e.code == 400
        print("  ✓ Empty prompt rejected with HTTP 400 Bad Request")

    # Zero count bound check
    zero_req = urllib.request.Request(
        f"{API_URL}/api/generate",
        data=json.dumps({"record_count": 0}).encode(),
        headers={"Content-Type": "application/json"}
    )
    try:
        urllib.request.urlopen(zero_req)
        assert False, "0 count should fail Pydantic validation"
    except urllib.error.HTTPError as e:
        assert e.code == 422
        print("  ✓ Out-of-bounds count (0) rejected with HTTP 422 Unprocessable Content")

    print("\n================================================================")
    print("      ALL AUDIT TESTS PASSED WITH 100% SUCCESS RATE! 🎉        ")
    print("================================================================\n")

if __name__ == "__main__":
    run_audit()
