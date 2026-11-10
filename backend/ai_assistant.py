"""
AI Assistant Module for PrivacyGuard.
Parses natural language prompts such as:
"Generate 100 synthetic student records with name, email, roll number, department, and address"
Interprets record counts, categories, and field requests, and returns generated datasets.
"""

import re
from typing import Dict, Any, List, Tuple
from generator import generate_dataset


# Dictionary of known field keywords to canonical column names
FIELD_SYNONYMS = {
    "name": "Name",
    "full name": "Name",
    "student name": "Name",
    "email": "Email",
    "email id": "Email",
    "mail": "Email",
    "roll number": "Roll Number",
    "roll no": "Roll Number",
    "roll": "Roll Number",
    "register number": "Roll Number",
    "registration": "Roll Number",
    "phone": "Phone Number",
    "phone number": "Phone Number",
    "mobile": "Phone Number",
    "contact": "Phone Number",
    "address": "Address",
    "location": "Address",
    "city": "Address",
    "age": "Age",
    "department": "Department",
    "dept": "Department",
    "branch": "Department",
    "stream": "Department",
    "semester": "Semester",
    "sem": "Semester",
    "cgpa": "CGPA",
    "gpa": "CGPA",
    "marks": "CGPA",
    "attendance": "Attendance (%)",
    "blood group": "Blood Group",
    "hostel": "Hostel Resident",
    "admission year": "Admission Year",
    "graduation year": "Graduation Year"
}


def parse_prompt(prompt: str) -> Tuple[int, str, List[str], str]:
    """
    Parses a natural language instruction into:
    - record count
    - category
    - column list
    - AI explanation
    """
    p_lower = prompt.lower()

    # 1. Extract Record Count
    count = 50  # Default
    # Check for patterns like "100 records", "50 students", "generate 200", "count: 75"
    number_matches = re.findall(r'\b(\d{1,4})\b', p_lower)
    if number_matches:
        for num_str in number_matches:
            val = int(num_str)
            # Avoid picking years like 2026 or 2025 as count
            if val not in [2024, 2025, 2026, 2027, 2028, 2030] and 1 <= val <= 2000:
                count = val
                break

    # 2. Extract Category
    category = "Indian Students"
    if any(k in p_lower for k in ["patient", "hospital", "medical", "doctor", "health", "clinic"]):
        category = "Healthcare / Medical"
    elif any(k in p_lower for k in ["customer", "ecommerce", "e-commerce", "shopper", "order", "sales"]):
        category = "E-Commerce Customers"
    elif any(k in p_lower for k in ["employee", "staff", "hr", "corporate", "worker", "salary"]):
        category = "Corporate / HR"

    # 3. Extract Columns
    detected_columns = []
    
    # Check multi-word keys first
    for kw, canonical in sorted(FIELD_SYNONYMS.items(), key=lambda x: -len(x[0])):
        pattern = r'\b' + re.escape(kw) + r'\b'
        if re.search(pattern, p_lower):
            if canonical not in detected_columns:
                detected_columns.append(canonical)

    # If no specific columns mentioned in prompt, provide standard default columns for category
    if not detected_columns:
        if category == "Indian Students":
            detected_columns = ["Name", "Email", "Roll Number", "Department", "Phone Number", "Address", "Age"]
        elif category == "Healthcare / Medical":
            detected_columns = ["Patient ID", "Name", "Age", "Gender", "Blood Group", "Department", "Status", "Contact"]
        elif category == "E-Commerce Customers":
            detected_columns = ["Customer ID", "Name", "Email", "Phone", "City", "Loyalty Tier", "Total Orders", "Total Spend (INR)"]
        else:
            detected_columns = ["Employee ID", "Name", "Official Email", "Department", "Experience (Years)", "Annual CTC (INR)", "Work Location"]

    explanation = (
        f"AI Assistant parsed your request: Interpreted target category as '{category}', "
        f"generating {count} fictional records with columns: {', '.join(detected_columns)}. "
        f"Zero real personal information will be used; all identifiers strictly conform to RFC test standards."
    )

    return count, category, detected_columns, explanation


def process_ai_generation_request(prompt: str) -> Dict[str, Any]:
    """Handles an AI generation request end-to-end."""
    count, category, columns, explanation = parse_prompt(prompt)
    dataset_name = f"AI_Generated_{category.replace(' ', '_')}_{count}"
    
    result = generate_dataset(
        name=dataset_name,
        count=count,
        category=category,
        columns=columns
    )
    
    result["ai_explanation"] = explanation
    result["prompt"] = prompt
    return result

