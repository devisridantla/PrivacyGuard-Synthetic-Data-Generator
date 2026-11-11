<<<<<<< HEAD
# PrivacyGuard – Synthetic Data Generator

> **Privacy-Preserving AI-Powered Synthetic Data Platform**  
> Generate high-fidelity, completely fictional datasets for testing, research, software development, and academic demonstrations without exposing real people's personal information.

---

## 🛡️ Core Highlights

- **100% Synthetic Guarantee**: Purely algorithmic identities, phone numbers, roll numbers, and addresses. Zero 1-to-1 mapping to real human beings.
- **IETF RFC 2606 Compliant**: All emails strictly use reserved test domains (`@example.com`, `@example.org`, `@student.example.org`). Real commercial email providers (e.g. Gmail, Yahoo) are blocked.
- **Indian College Demographics**: Curated authentic first names and surnames, realistic departmental roll numbers (`CSE2026042`, `ECE2025014`), fictional Indian addresses across major hubs (Bengaluru, Hyderabad, Pune, Mumbai, Delhi, etc.), and realistic bell-curved GPA metrics.
- **Multi-Format Instant Exports**: Working one-click downloads in Excel (`.xlsx` with custom-styled headers and an official Privacy & Compliance Certificate sheet), CSV (`.csv`), and structured JSON (`.json`).
- **AI Assistant Studio**: Instruct the generator in natural English (e.g., *"Generate 100 synthetic student records with name, email, roll number, department, and address"*). The built-in NLP engine parses parameters and creates the dataset.
- **Dual-Mode Persistence (Supabase + SQLite)**: Live cloud integration with Supabase for metadata & export history, with seamless automatic fallback to local SQLite (`privacyguard.db`). Never stores raw personal records.
- **Compliance Alignment**: Aligned with the India Digital Personal Data Protection (DPDP) Act 2023, EU GDPR Article 89, and ISO/IEC 20889.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS, Lucide React, Canvas Confetti, Vite |
| **Backend** | Python 3.14, FastAPI, Uvicorn, Pydantic v2 |
| **Data Processing** | Python Pandas, NumPy |
| **File Generation** | OpenPyXL (Excel), Python CSV & JSON |
| **Database** | Supabase Cloud (with local embedded SQLite fallback) |
| **AI Integration** | Generative NLP schema parser & synthesis engine |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python**: 3.10+ (tested on Python 3.14)
- **Node.js**: v18+ (tested on Node v26)

### 2. Backend Setup & Startup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies (already installed if running in this environment)
python -m pip install -r requirements.txt

# Start the FastAPI server on port 8000
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Swagger Interactive API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 3. Frontend Setup & Startup
```bash
# Open a second terminal and navigate to the frontend directory
cd frontend

# Install dependencies (already installed)
npm install

# Start the Vite development server on port 5173
npm run dev
```
- **Frontend Web Application**: [http://localhost:5173](http://localhost:5173)

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check, version info, and database provider status |
| `POST` | `/api/generate` | Generates synthetic datasets with analytics and metadata persistence |
| `POST` | `/api/custom-columns/generate` | Generates synthetic values for a specific custom column definition |
| `POST` | `/api/ai/generate` | Generates dataset from natural language prompt |
| `POST` | `/api/validate-privacy` | Performs privacy audit and returns compliance score (0–100%) |
| `POST` | `/api/check-duplicates` | Scans dataset records for duplicates using Pandas |
| `POST` | `/api/validate-dataset` | Full dataset validation (nulls, schema, duplicates, privacy) |
| `POST` | `/api/export/excel` | Streams styled multi-sheet Excel (.xlsx) file |
| `POST` | `/api/export/csv` | Streams CSV (.csv) file with privacy disclaimer |
| `POST` | `/api/export/json` | Streams formatted JSON (.json) file |
| `GET` | `/api/history` | Fetches generation and export logs from Supabase or SQLite |
| `POST` | `/api/supabase/test` | Tests live Supabase credentials |

---

## 🗄️ Supabase Cloud Integration

To sync dataset metadata with your Supabase Cloud project:
1. Open your project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** and run the script in [`supabase_schema.sql`](file:///c:/Users/dantl/OneDrive/Desktop/Synthetic%20data%20generator/supabase_schema.sql).
3. Set your credentials in `backend/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-supabase-anon-or-service-key
   ```
   *Or test credentials directly from the frontend UI via the **Supabase** modal button in the top navbar!*

---

## ⚖️ Ethical & Legal Disclaimer

All identities, names, roll numbers, telephone numbers, emails, and residential addresses generated by PrivacyGuard are algorithmic computer fabrications. Any resemblance to real persons, living or deceased, or actual corporate entities is purely coincidental.

=======
# PrivacyGuard-Synthetic-Dayta-Generator
AI-Powered Privacy-Safe Synthetic Data Generator
>>>>>>> dd1b733e09c892ba8f6771fc70935a6699a1b348
