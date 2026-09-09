"""
Student Academic Hub - Python Flask REST API Backend
Provides REST endpoints and automated link health verification for the Academic Hub frontend.
Can use SQLite or an embedded JSON file store.
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import json
import os
import time
from datetime import datetime

app = Flask(__name__, static_folder=None)
CORS(app)  # Enable Cross-Origin requests from the frontend

DATA_FILE = os.path.join(os.path.dirname(__file__), "academic_store.json")

# Helper to load dataset
def get_db():
    if not os.path.exists(DATA_FILE):
        # Fallback: create empty schema structure
        initial = {
            "regulations": [
                {"id": "reg-2024", "year": "2024", "name": "2024 Regulation (Autonomous & CBCS)", "isLatest": True, "description": "Latest curriculum with AI/ML integration and industry credits."},
                {"id": "reg-2021", "year": "2021", "name": "2021 Regulation (Anna Univ & Affiliated)", "isLatest": False, "description": "Standard outcome-based education (OBE) curriculum."},
                {"id": "reg-2017", "year": "2017", "name": "2017 Regulation", "isLatest": False, "description": "Prior CBCS syllabus system."}
            ],
            "departments": [
                {"id": "cse", "code": "CSE", "name": "Computer Science & Engineering", "icon": "💻", "color": "#3b82f6"},
                {"id": "aids", "code": "AI & DS", "name": "Artificial Intelligence & Data Science", "icon": "🤖", "color": "#8b5cf6"},
                {"id": "it", "code": "IT", "name": "Information Technology", "icon": "🌐", "color": "#06b6d4"},
                {"id": "ece", "code": "ECE", "name": "Electronics & Communication Engineering", "icon": "⚡", "color": "#f59e0b"},
                {"id": "mech", "code": "MECH", "name": "Mechanical Engineering", "icon": "⚙️", "color": "#10b981"}
            ],
            "semesters": [
                {"id": 1, "name": "Semester 1", "badge": "Year 1"},
                {"id": 2, "name": "Semester 2", "badge": "Year 1"},
                {"id": 3, "name": "Semester 3", "badge": "Year 2"},
                {"id": 4, "name": "Semester 4", "badge": "Year 2"},
                {"id": 5, "name": "Semester 5", "badge": "Year 3"},
                {"id": 6, "name": "Semester 6", "badge": "Year 3"},
                {"id": 7, "name": "Semester 7", "badge": "Year 4"},
                {"id": 8, "name": "Semester 8", "badge": "Year 4"}
            ],
            "subjects": []
        }
        save_db(initial)
        return initial
    
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# --- Routes ---

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat(), "service": "Student Academic Hub Backend"})

@app.route("/api/regulations", methods=["GET"])
def get_regulations():
    db = get_db()
    return jsonify(db.get("regulations", []))

@app.route("/api/departments", methods=["GET"])
def get_departments():
    db = get_db()
    return jsonify(db.get("departments", []))

@app.route("/api/semesters", methods=["GET"])
def get_semesters():
    db = get_db()
    return jsonify(db.get("semesters", []))

@app.route("/api/subjects", methods=["GET"])
def get_subjects():
    db = get_db()
    subjects = db.get("subjects", [])

    # Filters
    reg = request.args.get("regulationId")
    dept = request.args.get("departmentId")
    sem = request.args.get("semesterId")
    q = request.args.get("searchQuery", "").strip().lower()

    if reg:
        subjects = [s for s in subjects if s.get("regulationId") == reg]
    if dept:
        subjects = [s for s in subjects if s.get("departmentId") == dept]
    if sem:
        subjects = [s for s in subjects if str(s.get("semesterId")) == str(sem)]
    if q:
        subjects = [
            s for s in subjects
            if q in s.get("name", "").lower() or q in s.get("code", "").lower() or q in s.get("summary", "").lower()
        ]

    return jsonify(subjects)

@app.route("/api/subjects/<subject_id>", methods=["GET"])
def get_subject_by_id(subject_id):
    db = get_db()
    subject = next((s for s in db.get("subjects", []) if s.get("id") == subject_id), None)
    if subject:
        return jsonify(subject)
    return jsonify({"error": "Subject not found"}), 404

@app.route("/api/subjects", methods=["POST"])
def add_subject():
    data = request.get_json() or {}
    if not data.get("code") or not data.get("name"):
        return jsonify({"error": "Code and name are required"}), 400

    db = get_db()
    subject_id = data.get("id") or ("sub-" + data["code"].lower().replace(" ", ""))
    data["id"] = subject_id
    if "resources" not in data:
        data["resources"] = {
            "syllabus": [], "notes": [], "videos": [], "classwork": [],
            "labManual": [], "practicalQuestions": [], "questionPapers": [],
            "importantQuestions": [], "otherResources": []
        }

    db["subjects"].append(data)
    save_db(db)
    return jsonify(data), 201

@app.route("/api/subjects/<subject_id>", methods=["PUT"])
def update_subject(subject_id):
    update_data = request.get_json() or {}
    db = get_db()
    subjects = db.get("subjects", [])
    for idx, s in enumerate(subjects):
        if s.get("id") == subject_id:
            s.update(update_data)
            db["subjects"][idx] = s
            save_db(db)
            return jsonify(s)
    return jsonify({"error": "Subject not found"}), 404

@app.route("/api/subjects/<subject_id>", methods=["DELETE"])
def delete_subject(subject_id):
    db = get_db()
    initial_len = len(db.get("subjects", []))
    db["subjects"] = [s for s in db.get("subjects", []) if s.get("id") != subject_id]
    if len(db["subjects"]) < initial_len:
        save_db(db)
        return jsonify({"success": True})
    return jsonify({"error": "Subject not found"}), 404

# Automated Real URL Verification endpoint
@app.route("/api/links/verify", methods=["POST"])
def verify_link():
    data = request.get_json() or {}
    url = data.get("url")
    if not url:
        return jsonify({"error": "URL is required"}), 400

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 StudentAcademicHub/1.0"
    }

    start_time = time.time()
    try:
        # Try HEAD first
        resp = requests.head(url, headers=headers, timeout=5, allow_redirects=True)
        # If HEAD is 405 Method Not Allowed or 403, fallback to GET with stream
        if resp.status_code in [405, 403]:
            resp = requests.get(url, headers=headers, timeout=5, stream=True, allow_redirects=True)

        latency_ms = int((time.time() - start_time) * 1000)
        is_active = resp.status_code < 400

        return jsonify({
            "url": url,
            "status": "active" if is_active else "warning",
            "status_code": resp.status_code,
            "latency_ms": latency_ms,
            "message": f"HTTP {resp.status_code} OK" if is_active else f"HTTP {resp.status_code}",
            "verified_at": datetime.utcnow().isoformat()
        })
    except requests.exceptions.Timeout:
        return jsonify({
            "url": url,
            "status": "warning",
            "status_code": 408,
            "latency_ms": 5000,
            "message": "Connection Timeout",
            "verified_at": datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({
            "url": url,
            "status": "broken",
            "status_code": 500,
            "latency_ms": 0,
            "message": str(e),
            "verified_at": datetime.utcnow().isoformat()
        })

STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Serve Frontend Static Assets and Single-Page Application Index
@app.route("/", defaults={"path": ""}, methods=["GET"])
@app.route("/<path:path>", methods=["GET"])
def serve_frontend(path):
    # Do not intercept API requests
    if path.startswith("api"):
        return jsonify({"error": "API route not found"}), 404
        
    if not path or path == "index.html":
        return send_from_directory(STATIC_DIR, "index.html")
    
    file_path = os.path.join(STATIC_DIR, path)
    if os.path.isfile(file_path):
        return send_from_directory(STATIC_DIR, path)
        
    # Fallback to index.html for client-side routing
    return send_from_directory(STATIC_DIR, "index.html")

if __name__ == "__main__":
    print("🎓 Student Academic Hub Backend starting at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
