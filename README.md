# 🎓 Student Academic Hub

A modern, responsive college student academic resource portal designed to bring all study materials, syllabi, lecture notes, video playlists, lab manuals, and previous year question papers into one unified directory.

> **Important Copyright & Fair Use Notice:**  
> Student Academic Hub **does NOT host, upload, or store** any PDFs, videos, question papers, or copyrighted files. Every resource card provides direct, clickable external links to original official university portals (e.g. Anna University, AICTE) or authorized educational repositories (NPTEL, MIT OCW, GeeksforGeeks, MoE Virtual Labs).

---

## 🚀 Navigation Flow

```
Home / Regulations → Department → Semester → Subject → Resource Hub
```

### Example Flow:
`2024 Regulation` → `CSE` → `Semester 5` → `CS3551 – Distributed Computing`

---

## 📚 9 Resource Categories Per Subject

Each subject displays 9 distinct categories:

1. 📘 **Syllabus** (Official university course syllabus and unit-wise breakdown)
2. 📝 **Notes** (Lecture slides, chapter tutorials, and study materials)
3. 🎥 **Explanation Videos** (NPTEL, SWAYAM, MIT OCW, YouTube playlists)
4. 📑 **Classwork (CW)** (Tutorial problem sheets, weekly exercises)
5. 🧪 **Lab Manual** (Official lab manuals, observation notes, MoE Virtual Labs)
6. 💻 **Practical Questions** (Hands-on coding questions, socket/RPC programming, test cases)
7. 📄 **Previous Question Papers** (Past university semester exam archives)
8. ⭐ **Important Questions** (Repeated 2-mark & 16-mark high-yield exam questions)
9. 🔗 **Other Resources** (Free open textbooks, cheatsheets, reference handbooks)

---

## ✨ Features

- **Clean, Modern, Student-Friendly UI**: Deep academy navy with electric indigo/cyan glassmorphic styling, smooth micro-animations, and dynamic card hover elevations.
- **Dark & Light Mode**: Built-in theme switcher with preference persistence.
- **Mobile, Tablet & Desktop Responsive**: Fluid responsive layout tested across mobile screens, tablets, and wide monitors.
- **Live Search & Filter**: Instant search across subject codes (e.g. `CS3551`), subject titles, topics, and resource names with `Ctrl+K` keyboard shortcut.
- **Link Verification Badges**:
  - `[🏛️ Official Source]` vs `[🌐 External Educational Resource]` distinction.
  - Active verified status indicator with timestamp.
- **Admin Dashboard**:
  - Add, edit, and delete subjects and courses.
  - Add verified external links directly into any of the 9 categories.
  - Run **Automated Link Verification** to batch test link health.
  - Export and import JSON backups.
- **Pinned Favorites & Quick Jump**: Pin frequently accessed subjects for 1-click access.
- **Designated Advertisement Slots**: Clearly labeled `Advertisement / Sponsored` spaces integrated cleanly into the layout.

---

## 🛠️ Project Structure

```
d:\teja pro 9\
├── index.html               # Main entry point & layout
├── css\
│   └── styles.css           # Complete responsive academic design system
├── js\
│   ├── data.js              # Initial seed academic catalog (2024 Reg, CSE, CS3551, etc.)
│   ├── api.js               # Service layer (LocalStorage + Flask API toggle)
│   ├── admin.js             # Admin management & automated link checker
│   └── app.js               # UI controller, routing, and search
├── backend\
│   ├── app.py               # Optional Flask REST API backend with automated URL verification
│   └── requirements.txt     # Python dependencies
└── README.md
```

---

## 💻 How to Run

### Option 1: Direct Browser (Zero Installation)
Simply double-click `index.html` or open it with any web browser (Chrome, Edge, Firefox). The portal is completely self-contained with offline-first LocalStorage persistence.

### Option 2: Using Local HTTP Server
If using Python:
```powershell
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

### Option 3: Connecting with the Flask Backend
To use the Python Flask backend with live URL pinging and SQLite/JSON storage:
1. Install Python dependencies:
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```
2. Start the Flask server:
   ```powershell
   python app.py
   ```
   The backend will start at `http://127.0.0.1:5000`.
3. In `js/api.js`, set `this.USE_BACKEND_API = true;` to route all operations to the Flask REST API.
