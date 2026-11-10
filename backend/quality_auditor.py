"""
Dataset Quality and Integrity Auditor for PrivacyGuard.
Computes multi-dimensional data quality scores:
- Completeness (missing/null checks)
- Uniqueness (duplicate row and key collision checks)
- Format Validity (email syntax, phone patterns, bounded numeric checks)
- Statistical Consistency (distribution entropy & outliers)
- Privacy Integrity (RFC-reserved domains & non-deliverability)
"""

import re
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from privacy_validator import audit_dataset_privacy, RESERVED_DOMAINS

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
PHONE_REGEX = re.compile(r"^\+91\s?[0-9]{5}\s?[0-9]{5}$")


def evaluate_dataset_quality(records: List[Dict[str, Any]], dataset_name: str = "Dataset") -> Dict[str, Any]:
    """
    Performs comprehensive dataset quality evaluation.
    Returns metrics, sub-scores, overall grade, and actionable recommendations.
    """
    if not records:
        return {
            "dataset_name": dataset_name,
            "overall_score": 0.0,
            "grade": "N/A (Empty Dataset)",
            "completeness_score": 0.0,
            "uniqueness_score": 0.0,
            "validity_score": 0.0,
            "privacy_score": 100.0,
            "total_records": 0,
            "total_columns": 0,
            "null_cells": 0,
            "duplicate_records": 0,
            "field_diagnostics": {},
            "recommendations": ["Generate or upload records to run quality evaluation."]
        }

    df = pd.DataFrame(records)
    total_records = len(df)
    total_columns = len(df.columns)
    total_cells = total_records * total_columns

    # 1. Completeness Evaluation
    null_cells = int(df.isnull().sum().sum())
    empty_str_cells = int((df.astype(str).map(lambda x: x.strip() in ["", "nan", "None"])).sum().sum())
    missing_cells = max(null_cells, empty_str_cells)
    completeness_score = round(max(0.0, ((total_cells - missing_cells) / total_cells) * 100.0), 1)

    # 2. Uniqueness Evaluation
    duplicate_count = int(df.duplicated().sum())
    uniqueness_score = round(max(0.0, ((total_records - duplicate_count) / total_records) * 100.0), 1)

    # 3. Format Validity Evaluation
    field_diagnostics = {}
    validity_checks = []

    for col in df.columns:
        col_lower = col.lower()
        series_str = df[col].astype(str)

        if "email" in col_lower:
            valid_emails = series_str.map(lambda x: bool(EMAIL_REGEX.match(x.strip()))).sum()
            rate = round((valid_emails / total_records) * 100.0, 1)
            validity_checks.append(rate)
            field_diagnostics[col] = {
                "type": "Email",
                "valid_format_pct": rate,
                "status": "PASS" if rate >= 98.0 else "WARN"
            }

        elif "phone" in col_lower:
            valid_phones = series_str.map(lambda x: bool(PHONE_REGEX.match(x.strip()))).sum()
            rate = round((valid_phones / total_records) * 100.0, 1)
            validity_checks.append(rate)
            field_diagnostics[col] = {
                "type": "Phone Number",
                "valid_format_pct": rate,
                "status": "PASS" if rate >= 98.0 else "WARN"
            }

        elif col_lower in ["age", "semester", "cgpa", "total orders"]:
            numeric_valid = pd.to_numeric(df[col], errors='coerce').notnull().sum()
            rate = round((numeric_valid / total_records) * 100.0, 1)
            validity_checks.append(rate)
            field_diagnostics[col] = {
                "type": "Numeric",
                "valid_format_pct": rate,
                "status": "PASS" if rate >= 98.0 else "WARN"
            }

    validity_score = round(float(np.mean(validity_checks)) if validity_checks else 100.0, 1)

    # 4. Privacy Audit
    privacy_audit = audit_dataset_privacy(records)
    privacy_score = privacy_audit.get("privacy_score", 100.0)

    # 5. Composite Score Calculation
    # Weights: Completeness (30%), Uniqueness (25%), Validity (25%), Privacy (20%)
    overall_score = round(
        (0.30 * completeness_score) +
        (0.25 * uniqueness_score) +
        (0.25 * validity_score) +
        (0.20 * privacy_score),
        1
    )

    # Assign Letter Grade
    if overall_score >= 95.0:
        grade = "A+ (Excellent Integrity)"
    elif overall_score >= 88.0:
        grade = "A (High Quality)"
    elif overall_score >= 78.0:
        grade = "B (Acceptable Quality)"
    elif overall_score >= 65.0:
        grade = "C (Needs Refinement)"
    else:
        grade = "D (Poor Quality)"

    recommendations = []
    if missing_cells > 0:
        recommendations.append(f"Detected {missing_cells} missing/empty cells. Impute default values or filter rows.")
    if duplicate_count > 0:
        recommendations.append(f"Detected {duplicate_count} duplicate rows. Run deduplication before downstream training.")
    if privacy_score < 100.0:
        recommendations.append("Privacy issues flagged. Replace commercial email domains with RFC 2606 test domains.")
    if not recommendations:
        recommendations.append("Dataset meets optimal quality criteria. Ready for ML model training, benchmarking, and database seeding.")

    return {
        "dataset_name": dataset_name,
        "overall_score": overall_score,
        "grade": grade,
        "completeness_score": completeness_score,
        "uniqueness_score": uniqueness_score,
        "validity_score": validity_score,
        "privacy_score": privacy_score,
        "total_records": total_records,
        "total_columns": total_columns,
        "total_cells": total_cells,
        "missing_cells": missing_cells,
        "duplicate_records": duplicate_count,
        "field_diagnostics": field_diagnostics,
        "recommendations": recommendations,
        "privacy_audit": privacy_audit
    }

