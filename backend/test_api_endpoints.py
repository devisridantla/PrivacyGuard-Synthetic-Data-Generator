"""
API Endpoints Test Script for PrivacyGuard FastAPI.
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_api():
    print("Testing /api/health...")
    r = client.get("/api/health")
    assert r.status_code == 200
    print("Health response:", r.json())

    print("Testing /api/generate...")
    gen_payload = {
        "dataset_name": "Indian_College_Test",
        "record_count": 25,
        "category": "Indian Students",
        "columns": ["Name", "Email", "Roll Number", "Department", "Age", "Phone Number", "Address"]
    }
    r = client.post("/api/generate", json=gen_payload)
    assert r.status_code == 200, r.text
    gen_data = r.json()
    assert gen_data["record_count"] == 25
    assert len(gen_data["records"]) == 25
    assert "privacy_audit" in gen_data
    assert gen_data["privacy_audit"]["privacy_score"] == 100.0
    print("✓ /api/generate succeeded with 25 records and 100% privacy score")

    print("Testing /api/ai/generate...")
    ai_payload = {
        "prompt": "Generate 30 synthetic student records with name, email, roll number, department, and address"
    }
    r = client.post("/api/ai/generate", json=ai_payload)
    assert r.status_code == 200, r.text
    ai_data = r.json()
    assert ai_data["record_count"] == 30
    assert "ai_explanation" in ai_data
    print("✓ /api/ai/generate succeeded!")

    print("Testing /api/validate-privacy...")
    r = client.post("/api/validate-privacy", json={"records": gen_data["records"]})
    assert r.status_code == 200
    assert r.json()["is_safe"] is True
    print("✓ /api/validate-privacy passed!")

    print("Testing /api/check-duplicates...")
    r = client.post("/api/check-duplicates", json={"records": gen_data["records"]})
    assert r.status_code == 200
    assert r.json()["duplicate_count"] == 0
    print("✓ /api/check-duplicates passed!")

    print("Testing /api/export/excel...")
    r = client.post("/api/export/excel", json={
        "dataset_name": "Indian_College_Test",
        "records": gen_data["records"]
    })
    assert r.status_code == 200
    assert r.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    print("✓ /api/export/excel returned valid Excel streaming response!")

    print("Testing /api/export/csv...")
    r = client.post("/api/export/csv", json={
        "dataset_name": "Indian_College_Test",
        "records": gen_data["records"]
    })
    assert r.status_code == 200
    assert "text/csv" in r.headers["content-type"]
    print("✓ /api/export/csv returned valid CSV streaming response!")

    print("Testing /api/export/json...")
    r = client.post("/api/export/json", json={
        "dataset_name": "Indian_College_Test",
        "records": gen_data["records"]
    })
    assert r.status_code == 200
    assert "application/json" in r.headers["content-type"]
    print("✓ /api/export/json returned valid JSON streaming response!")

    print("Testing /api/history...")
    r = client.get("/api/history")
    assert r.status_code == 200
    assert "datasets" in r.json()
    assert "exports" in r.json()
    print("✓ /api/history returned dataset logs!")

    print("\nALL API ENDPOINTS VERIFIED & WORKING PERFECTLY! 🚀")

if __name__ == "__main__":
    test_api()

