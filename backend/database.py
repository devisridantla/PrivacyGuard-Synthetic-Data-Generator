"""
Database module for PrivacyGuard.
Provides dual-mode persistence:
1. Supabase (when SUPABASE_URL and SUPABASE_KEY are provided)
2. Local SQLite fallback (embedded, zero-configuration, robust)

Stores strictly metadata and export history, never storing raw fictional PII.
"""

import os
import sqlite3
import datetime
import uuid
import json
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()

DB_FILE = os.path.join(os.path.dirname(__file__), "privacyguard.db")

# Initialize Supabase client if configured
supabase_client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client, Client
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Connected to Supabase successfully.")
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}. Falling back to SQLite.")
        supabase_client = None


def init_sqlite_db():
    """Initializes local SQLite tables for metadata and export history."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS dataset_metadata (
            id TEXT PRIMARY KEY,
            dataset_name TEXT NOT NULL,
            category TEXT NOT NULL,
            record_count INTEGER NOT NULL,
            columns TEXT NOT NULL,
            format TEXT DEFAULT 'json',
            privacy_score REAL DEFAULT 100.0,
            created_at TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS export_history (
            id TEXT PRIMARY KEY,
            dataset_id TEXT,
            dataset_name TEXT NOT NULL,
            export_format TEXT NOT NULL,
            records_exported INTEGER NOT NULL,
            exported_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

# Initialize local SQLite DB on load
init_sqlite_db()


def test_supabase_connection(url: str, key: str) -> Dict[str, Any]:
    """Tests Supabase credentials."""
    if not url or not key:
        return {"success": False, "message": "Supabase URL and Key are required"}
    try:
        from supabase import create_client
        client = create_client(url, key)
        # Try a lightweight query
        res = client.table("dataset_metadata").select("id").limit(1).execute()
        return {"success": True, "message": "Successfully connected to Supabase table 'dataset_metadata'!"}
    except Exception as e:
        err_msg = str(e)
        if "relation" in err_msg.lower() or "table" in err_msg.lower():
            return {
                "success": True,
                "warning": True,
                "message": "Connected to Supabase, but 'dataset_metadata' table not found. Please run the supabase_schema.sql script in Supabase SQL Editor."
            }
        return {"success": False, "message": f"Supabase connection error: {err_msg}"}


def get_db_status() -> Dict[str, Any]:
    """Returns the current database provider status."""
    is_supabase = supabase_client is not None
    return {
        "provider": "supabase" if is_supabase else "sqlite",
        "supabase_connected": is_supabase,
        "supabase_url_configured": bool(SUPABASE_URL),
        "db_location": "Supabase Cloud" if is_supabase else DB_FILE
    }


def save_dataset_metadata(name: str, category: str, count: int, columns: List[str], format_type: str = "json", privacy_score: float = 100.0) -> Dict[str, Any]:
    """Saves dataset creation metadata to Supabase or SQLite."""
    record_id = str(uuid.uuid4())
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    metadata = {
        "id": record_id,
        "dataset_name": name,
        "category": category,
        "record_count": count,
        "columns": columns,
        "format": format_type,
        "privacy_score": privacy_score,
        "created_at": now_iso
    }
    
    # Try Supabase first
    if supabase_client:
        try:
            db_payload = {
                "id": record_id,
                "dataset_name": name,
                "category": category,
                "record_count": count,
                "columns": columns,  # JSONB
                "format": format_type,
                "privacy_score": privacy_score,
                "created_at": now_iso
            }
            supabase_client.table("dataset_metadata").insert(db_payload).execute()
            metadata["stored_in"] = "supabase"
            return metadata
        except Exception as e:
            print(f"Supabase insert failed: {e}. Saving to SQLite fallback.")

    # SQLite fallback
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO dataset_metadata (id, dataset_name, category, record_count, columns, format, privacy_score, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (record_id, name, category, count, json.dumps(columns), format_type, privacy_score, now_iso)
        )
        conn.commit()
        conn.close()
        metadata["stored_in"] = "sqlite"
    except Exception as e:
        print(f"SQLite save error: {e}")
        metadata["stored_in"] = "memory_only"

    return metadata


def log_export_event(dataset_name: str, export_format: str, records_exported: int, dataset_id: Optional[str] = None) -> Dict[str, Any]:
    """Logs an export event to Supabase or SQLite."""
    record_id = str(uuid.uuid4())
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    event = {
        "id": record_id,
        "dataset_id": dataset_id or str(uuid.uuid4()),
        "dataset_name": dataset_name,
        "export_format": export_format.upper(),
        "records_exported": records_exported,
        "exported_at": now_iso
    }

    if supabase_client:
        try:
            supabase_client.table("export_history").insert(event).execute()
            event["stored_in"] = "supabase"
            return event
        except Exception as e:
            print(f"Supabase export log failed: {e}")

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO export_history (id, dataset_id, dataset_name, export_format, records_exported, exported_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (record_id, event["dataset_id"], dataset_name, export_format.upper(), records_exported, now_iso)
        )
        conn.commit()
        conn.close()
        event["stored_in"] = "sqlite"
    except Exception as e:
        print(f"SQLite export log error: {e}")
        event["stored_in"] = "memory_only"

    return event


def get_history(limit: int = 15) -> Dict[str, Any]:
    """Fetches recent dataset generation metadata and export history."""
    datasets = []
    exports = []

    # Try Supabase
    if supabase_client:
        try:
            d_res = supabase_client.table("dataset_metadata").select("*").order("created_at", desc=True).limit(limit).execute()
            datasets = d_res.data or []
            e_res = supabase_client.table("export_history").select("*").order("exported_at", desc=True).limit(limit).execute()
            exports = e_res.data or []
            return {
                "source": "supabase",
                "datasets": datasets,
                "exports": exports,
                "total_datasets": len(datasets),
                "total_exports": len(exports)
            }
        except Exception as e:
            print(f"Supabase query failed: {e}. Querying SQLite.")

    # SQLite
    try:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM dataset_metadata ORDER BY created_at DESC LIMIT ?", (limit,))
        rows = cursor.fetchall()
        for r in rows:
            cols = []
            try:
                cols = json.loads(r["columns"])
            except Exception:
                cols = [r["columns"]]
            datasets.append({
                "id": r["id"],
                "dataset_name": r["dataset_name"],
                "category": r["category"],
                "record_count": r["record_count"],
                "columns": cols,
                "format": r["format"],
                "privacy_score": r["privacy_score"],
                "created_at": r["created_at"]
            })

        cursor.execute("SELECT * FROM export_history ORDER BY exported_at DESC LIMIT ?", (limit,))
        export_rows = cursor.fetchall()
        for er in export_rows:
            exports.append({
                "id": er["id"],
                "dataset_id": er["dataset_id"],
                "dataset_name": er["dataset_name"],
                "export_format": er["export_format"],
                "records_exported": er["records_exported"],
                "exported_at": er["exported_at"]
            })

        conn.close()
    except Exception as e:
        print(f"SQLite query error: {e}")

    return {
        "source": "sqlite",
        "datasets": datasets,
        "exports": exports,
        "total_datasets": len(datasets),
        "total_exports": len(exports)
    }

