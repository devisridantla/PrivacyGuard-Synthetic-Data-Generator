"""
Synthetic Data Generation Engine for PrivacyGuard.
Implements realistic, high-fidelity synthetic record generators
with strong privacy guarantees (RFC-reserved domains, fictional Indian identities).
Uses Pandas & NumPy for data manipulation, formatting, and statistical metrics.
"""

import random
import re
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional

# Authentic Indian Given Names (Fictionalized Combinations)
FIRST_NAMES = [
    "Aarav", "Priya", "Rohan", "Ananya", "Vikram", "Sneha", "Aditya", "Diya",
    "Aryan", "Kavya", "Ishaan", "Pooja", "Rahul", "Meera", "Arjun", "Riya",
    "Karthik", "Divya", "Kunal", "Neha", "Tanmay", "Shreya", "Siddharth", "Swati",
    "Pranav", "Anjali", "Abhinav", "Tanvi", "Harish", "Bhavna", "Varun", "Shalini",
    "Nikhil", "Deepika", "Manish", "Aditi", "Gaurav", "Ritika", "Akash", "Pooja",
    "Sameer", "Simran", "Yash", "Anushka", "Dev", "Isha", "Rishi", "Tara",
    "Suraj", "Nandini", "Mayank", "Preeti", "Suresh", "Lakshmi", "Rajesh", "Sunita",
    "Alok", "Pallavi", "Vivek", "Sanjana", "Tarun", "Aishwarya", "Ashwin", "Shruti"
]

SURNAMES = [
    "Sharma", "Patel", "Verma", "Iyer", "Singh", "Nair", "Gupta", "Rao",
    "Chatterjee", "Reddy", "Joshi", "Mukherjee", "Kulkarni", "Mehta", "Banerjee", "Agarwal",
    "Deshmukh", "Pillai", "Bhat", "Choudhury", "Nambiar", "Menon", "Saxena", "Mishra",
    "Pandey", "Chauhan", "Bhattacharya", "Shetty", "Gowda", "Garg", "Jain", "Kapoor",
    "Bose", "Ghosh", "Trivedi", "Sengupta", "Kumar", "Prasad", "Bhardwaj", "Shukla"
]

CITIES_STATES_PINCODES = [
    {"city": "Bengaluru", "state": "Karnataka", "pin_base": 560001, "areas": ["Indiranagar", "Koramangala", "HSR Layout", "Whitefield", "Jayanagar", "Malleshwaram"]},
    {"city": "Hyderabad", "state": "Telangana", "pin_base": 500001, "areas": ["Banjara Hills", "Jubilee Hills", "Gachibowli", "Madhapur", "Kukatpally", "Begumpet"]},
    {"city": "Chennai", "state": "Tamil Nadu", "pin_base": 600001, "areas": ["Anna Nagar", "T. Nagar", "Adyar", "Velachery", "Mylapore", "Besant Nagar"]},
    {"city": "Pune", "state": "Maharashtra", "pin_base": 411001, "areas": ["Koregaon Park", "Kothrud", "Viman Nagar", "Baner", "Aundh", "Hinjawadi"]},
    {"city": "Mumbai", "state": "Maharashtra", "pin_base": 400001, "areas": ["Andheri West", "Bandra", "Powai", "Juhu", "Dadar", "Borivali"]},
    {"city": "New Delhi", "state": "Delhi", "pin_base": 110001, "areas": ["Hauz Khas", "Connaught Place", "Saket", "Vasant Kunj", "Dwarka", "Rohini"]},
    {"city": "Kolkata", "state": "West Bengal", "pin_base": 700001, "areas": ["Salt Lake Sector V", "New Town", "Ballygunge", "Park Street", "Alipore", "Dum Dum"]},
    {"city": "Ahmedabad", "state": "Gujarat", "pin_base": 380001, "areas": ["Satellite", "Bodakdev", "Navrangpura", "Vastrapur", "Maninagar", "Paldi"]},
    {"city": "Jaipur", "state": "Rajasthan", "pin_base": 302001, "areas": ["Malviya Nagar", "Vaishali Nagar", "C-Scheme", "Mansarovar", "Raja Park"]},
    {"city": "Kochi", "state": "Kerala", "pin_base": 682001, "areas": ["Marine Drive", "Kakkanad", "Panampilly Nagar", "Edappally", "Fort Kochi"]}
]

HOUSING_PREFIXES = [
    "Flat 101, Shanti Vihar", "Plot 42, Krishna Residency", "Flat 402, Green Glen Towers",
    "B-14, Surya Enclave", "Villa 7, Palm Meadows", "12/A, Shivalik Apartments",
    "House 88, Lakeview Colony", "Flat 503, Prestige Heights", "Plot 19, Balaji Nagar",
    "45, Sharda Niwas", "Flat 204, Royal Palms", "Plot 112, Saraswati Enclave",
    "A-301, Silver Oak Society", "Flat 602, Sai Krupa Complex", "House 24, Gandhi Marg"
]

DEPARTMENTS = ["CSE", "ECE", "EEE", "IT", "Mechanical", "Civil", "AI & DS"]
BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
YEARS_OF_STUDY = [1, 2, 3, 4]


def generate_indian_address() -> str:
    """Generates a realistic yet fictional Indian residential address."""
    loc = random.choice(CITIES_STATES_PINCODES)
    house = random.choice(HOUSING_PREFIXES)
    area = random.choice(loc["areas"])
    pin = loc["pin_base"] + random.randint(1, 95)
    return f"{house}, {area}, {loc['city']}, {loc['state']} - {pin}"


def generate_fictional_phone() -> str:
    """
    Generates an Indian mobile number using reserved fictional prefixes.
    +91 91234 XXXXX or +91 98765 XXXXX (dummy ranges commonly reserved for testing)
    """
    prefix = random.choice(["+91 91234", "+91 98765", "+91 90000", "+91 99999"])
    suffix = random.randint(10000, 99999)
    return f"{prefix} {suffix}"


def generate_reserved_email(first_name: str, last_name: str, seq: int, roll_no: Optional[str] = None) -> str:
    """Generates email strictly inside RFC-reserved domains like @example.com or @student.example.org."""
    clean_first = re.sub(r'[^a-zA-Z]', '', first_name).lower()
    clean_last = re.sub(r'[^a-zA-Z]', '', last_name).lower()
    
    style = random.choice(["roll", "name_seq", "name_dot", "user_pad"])
    if style == "roll" and roll_no:
        return f"{roll_no.lower()}@student.example.org"
    elif style == "name_dot":
        return f"{clean_first}.{clean_last}{random.randint(10, 99)}@example.com"
    elif style == "user_pad":
        return f"user{seq:04d}@example.com"
    else:
        return f"{clean_first}{clean_last[:3]}{seq}@example.org"


def generate_indian_student_records(count: int, selected_columns: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """
    Generates realistic Indian student synthetic records.
    Fields supported:
      - Name
      - Email
      - Roll Number
      - Phone Number
      - Address
      - Age
      - Department
      - Semester
      - CGPA
      - Attendance (%)
      - Blood Group
      - Hostel Resident
      - Admission Year
    """
    if selected_columns is None or len(selected_columns) == 0:
        selected_columns = ["Name", "Email", "Roll Number", "Phone Number", "Address", "Age", "Department"]

    records = []
    current_year = 2026
    
    # We maintain departmental sequence numbers for realistic roll numbers
    dept_seq_counters = {dept: random.randint(10, 100) for dept in DEPARTMENTS}

    for i in range(1, count + 1):
        first = random.choice(FIRST_NAMES)
        last = random.choice(SURNAMES)
        full_name = f"{first} {last}"
        
        dept = random.choice(DEPARTMENTS)
        dept_code = dept.replace(" & ", "").replace(" ", "").upper()[:3]
        if dept == "AI & DS":
            dept_code = "AIDS"
        elif dept == "Civil":
            dept_code = "CIV"
        elif dept == "Mechanical":
            dept_code = "MECH"

        dept_seq_counters[dept] += 1
        seq_num = dept_seq_counters[dept]
        
        # Realistic student demographics
        year_study = random.choice([1, 2, 3, 4])
        admission_year = current_year - (year_study - 1)
        roll_no = f"{dept_code}{admission_year}{seq_num:03d}"
        
        # Age distribution realistic for undergrad college (18 to 23)
        base_age = 18 + (year_study - 1)
        age = int(np.clip(np.random.normal(base_age, 0.8), 18, 25))
        
        email = generate_reserved_email(first, last, i, roll_no)
        phone = generate_fictional_phone()
        address = generate_indian_address()
        semester = (year_study * 2) - random.choice([0, 1])
        
        # Realistic bell-curve for CGPA (average ~7.8, range 5.5 to 9.9)
        cgpa = round(float(np.clip(np.random.normal(7.85, 0.85), 5.50, 9.95)), 2)
        attendance = int(np.clip(np.random.normal(84, 8), 65, 99))
        blood_group = random.choice(BLOOD_GROUPS)
        hostel = random.choice(["Yes", "No"])

        # Master candidate record map (case-insensitive column matching)
        all_field_values = {
            "name": full_name,
            "email": email,
            "roll number": roll_no,
            "roll_number": roll_no,
            "rollno": roll_no,
            "phone number": phone,
            "phone_number": phone,
            "phone": phone,
            "address": address,
            "age": age,
            "department": dept,
            "semester": semester,
            "cgpa": cgpa,
            "attendance": f"{attendance}%",
            "attendance (%)": f"{attendance}%",
            "blood group": blood_group,
            "hostel resident": hostel,
            "admission year": admission_year,
            "graduation year": admission_year + 4
        }

        row = {}
        for col in selected_columns:
            norm_col = col.lower().strip()
            if norm_col in all_field_values:
                row[col] = all_field_values[norm_col]
            else:
                # Custom column fallback
                row[col] = f"Synthetic_{col}_{i}"

        records.append(row)

    return records


def generate_general_category_records(category: str, count: int, selected_columns: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """Generates synthetic records for other common business categories."""
    records = []
    for i in range(1, count + 1):
        first = random.choice(FIRST_NAMES)
        last = random.choice(SURNAMES)
        full_name = f"{first} {last}"
        email = f"customer_{i:04d}@example.com"
        phone = generate_fictional_phone()
        addr = generate_indian_address()

        if category == "Healthcare / Medical":
            patient_id = f"MED-2026-{1000 + i}"
            age = random.randint(18, 78)
            blood = random.choice(BLOOD_GROUPS)
            dept = random.choice(["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "General Medicine"])
            status = random.choice(["Outpatient", "Admitted", "Discharged", "Under Observation"])
            rec = {
                "Patient ID": patient_id,
                "Name": full_name,
                "Age": age,
                "Gender": random.choice(["Male", "Female"]),
                "Blood Group": blood,
                "Department": dept,
                "Status": status,
                "Contact": phone,
                "Address": addr
            }
        elif category == "E-Commerce Customers":
            cust_id = f"CUST-{20260000 + i}"
            tier = random.choice(["Bronze", "Silver", "Gold", "Platinum"])
            orders = random.randint(1, 45)
            spend = random.randint(500, 75000)
            rec = {
                "Customer ID": cust_id,
                "Name": full_name,
                "Email": email,
                "Phone": phone,
                "City": random.choice(["Bengaluru", "Hyderabad", "Mumbai", "Pune", "Delhi", "Chennai"]),
                "Loyalty Tier": tier,
                "Total Orders": orders,
                "Total Spend (INR)": f"₹{spend:,}",
                "Address": addr
            }
        elif category == "Corporate / HR":
            emp_id = f"EMP-{5000 + i}"
            dept = random.choice(["Engineering", "Product", "Quality Assurance", "Design", "Human Resources", "Finance"])
            exp = random.randint(1, 15)
            salary = 350000 + (exp * random.randint(80000, 160000))
            rec = {
                "Employee ID": emp_id,
                "Name": full_name,
                "Official Email": f"emp{i:03d}@example.org",
                "Department": dept,
                "Experience (Years)": exp,
                "Annual CTC (INR)": f"₹{salary:,}",
                "Work Location": random.choice(["Bengaluru Campus", "Hyderabad Tech Park", "Pune Office", "Remote"]),
                "Phone": phone
            }
        else:
            # Fallback to student records
            return generate_indian_student_records(count, selected_columns)

        # If user picked specific columns, filter to those or fill custom
        if selected_columns:
            filtered_row = {}
            for c in selected_columns:
                if c in rec:
                    filtered_row[c] = rec[c]
                elif c == "Phone Number" and "Contact" in rec:
                    filtered_row[c] = rec["Contact"]
                elif c == "Contact" and "Phone Number" in rec:
                    filtered_row[c] = rec["Phone Number"]
                elif c == "Contact" and "Phone" in rec:
                    filtered_row[c] = rec["Phone"]
                else:
                    filtered_row[c] = f"Synthetic_{c}_{i}"
            records.append(filtered_row)
        else:
            records.append(rec)

    return records


def generate_dataset(
    name: str,
    count: int,
    category: str = "Indian Students",
    columns: Optional[List[str]] = None,
    custom_columns: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """
    Main generator facade. Validates inputs, generates synthetic records,
    applies custom column rules, and computes statistical metadata with Pandas & NumPy.
    """
    # Enforce safe bounds
    safe_count = max(1, min(count, 5000))
    
    if columns is None or len(columns) == 0:
        if category == "Indian Students":
            columns = ["Name", "Email", "Roll Number", "Phone Number", "Address", "Age", "Department"]
        elif category == "Healthcare / Medical":
            columns = ["Patient ID", "Name", "Age", "Gender", "Blood Group", "Department", "Status", "Contact"]
        elif category == "E-Commerce Customers":
            columns = ["Customer ID", "Name", "Email", "Phone", "City", "Loyalty Tier", "Total Orders", "Total Spend (INR)"]
        else:
            columns = ["Employee ID", "Name", "Official Email", "Department", "Experience (Years)", "Annual CTC (INR)", "Work Location"]

    # Generate base records
    if category == "Indian Students":
        records = generate_indian_student_records(safe_count, columns)
    else:
        records = generate_general_category_records(category, safe_count, columns)

    # Attach any custom columns requested by user
    if custom_columns:
        for c_def in custom_columns:
            col_name = c_def.get("name")
            col_type = c_def.get("type", "text")
            options = c_def.get("options", "").split(",") if c_def.get("options") else []

            if not col_name:
                continue

            for idx, r in enumerate(records):
                if col_type == "number":
                    r[col_name] = random.randint(10, 100)
                elif col_type == "choice" and options:
                    r[col_name] = random.choice([o.strip() for o in options if o.strip()])
                elif col_type == "boolean":
                    r[col_name] = random.choice(["True", "False"])
                else:
                    r[col_name] = f"CustomVal_{idx+1}"

    # Use Pandas to verify dataset shape and compute analytics
    df = pd.DataFrame(records)
    
    # Duplicate checking
    duplicates_found = int(df.duplicated().sum())
    
    # Analytics summary
    analytics = compute_dataset_analytics(df)

    return {
        "dataset_name": name or f"Synthetic_{category.replace(' ', '_')}_{safe_count}",
        "category": category,
        "record_count": len(records),
        "columns": list(df.columns),
        "records": records,
        "duplicates_count": duplicates_found,
        "analytics": analytics
    }


def compute_dataset_analytics(df: pd.DataFrame) -> Dict[str, Any]:
    """Computes distribution stats and metrics using Pandas and NumPy."""
    analytics = {
        "total_records": len(df),
        "total_columns": len(df.columns),
        "memory_size_kb": round(float(df.memory_usage(deep=True).sum()) / 1024.0, 2),
        "department_distribution": {},
        "age_distribution": {},
        "summary_statistics": {}
    }

    if len(df) == 0:
        return analytics

    # Department distribution if present
    dept_col = None
    for col in df.columns:
        if col.lower() in ["department", "dept"]:
            dept_col = col
            break
    if dept_col:
        counts = df[dept_col].value_counts().to_dict()
        analytics["department_distribution"] = {str(k): int(v) for k, v in counts.items()}

    # Age distribution if present
    age_col = None
    for col in df.columns:
        if col.lower() == "age":
            age_col = col
            break
    if age_col and pd.api.types.is_numeric_dtype(df[age_col]):
        age_counts = df[age_col].value_counts().sort_index().to_dict()
        analytics["age_distribution"] = {str(k): int(v) for k, v in age_counts.items()}
        analytics["summary_statistics"]["age"] = {
            "mean": round(float(df[age_col].mean()), 1),
            "min": int(df[age_col].min()),
            "max": int(df[age_col].max()),
            "median": round(float(df[age_col].median()), 1)
        }

    # CGPA stats if present
    cgpa_col = None
    for col in df.columns:
        if "cgpa" in col.lower() or "gpa" in col.lower():
            cgpa_col = col
            break
    if cgpa_col and pd.api.types.is_numeric_dtype(df[cgpa_col]):
        analytics["summary_statistics"]["cgpa"] = {
            "mean": round(float(df[cgpa_col].mean()), 2),
            "min": round(float(df[cgpa_col].min()), 2),
            "max": round(float(df[cgpa_col].max()), 2),
            "median": round(float(df[cgpa_col].median()), 2)
        }

    return analytics

