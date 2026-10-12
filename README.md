# Lab Report Generator 📄

A full-stack web application for generating professional lab reports and cover pages as PDF, using **LaTeX** for typesetting.

## Features

- **Full Lab Report** — Multi-step form generating a complete report with:
  - Professional cover page with university/student details
  - Table of Contents
  - Objectives (bullet points)
  - Introduction & Conclusion
  - Multiple code blocks with syntax highlighting (Python, Java, C, C++, etc.)
  - Custom section headers and styled pages

- **Cover Page Only** — Quick cover page with optional group member table

- **Download Options** — PDF download + raw LaTeX `.tex` source
- **Overleaf fallback** — If pdflatex isn't installed, download the `.tex` and open it on [Overleaf.com](https://overleaf.com)

---

## Requirements

| Tool | Purpose |
|------|---------|
| **Node.js** (v18+) | Backend + Frontend |
| **pdflatex** (MiKTeX or TeX Live) | PDF compilation |

### Install Node.js
👉 https://nodejs.org/en/download

### Install MiKTeX (LaTeX for Windows)
👉 https://miktex.org/download  
After install, open **MiKTeX Console** and click **Check for updates** to install packages automatically.

---

## Quick Start

### 1. Install dependencies
Double-click **`install.bat`** or run:
```
cd server && npm install
cd ../client && npm install
```

### 2. Start the app
Double-click **`start.bat`** or run in two terminals:
```
# Terminal 1 - Backend
cd server && node index.js

# Terminal 2 - Frontend
cd client && npm start
```

### 3. Open in browser
```
http://localhost:3000
```

---

## Project Structure

```
lab-report-web/
├── server/
│   ├── index.js              # Express server entry
│   ├── routes/
│   │   ├── report.js         # Full report API
│   │   └── cover.js          # Cover page API
│   ├── templates/
│   │   └── latexTemplates.js # LaTeX generators
│   ├── utils/
│   │   └── latex.js          # PDF compilation util
│   └── outputs/              # Generated PDFs (auto-cleaned)
├── client/
│   └── src/
│       ├── App.js
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── Hero.js
│       │   ├── FullReportForm.js   # 6-step report form
│       │   ├── CoverPageForm.js    # Cover page form
│       │   └── Footer.js
│       └── index.css
├── install.bat               # Install all deps
├── start.bat                 # Start both services
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/report/generate` | Generate full report PDF |
| `POST` | `/api/report/latex` | Get LaTeX source only |
| `POST` | `/api/cover/generate` | Generate cover page PDF |
| `POST` | `/api/cover/latex` | Get cover LaTeX source |
| `GET`  | `/api/health` | Health check |

---

## Notes

- Generated PDFs are stored in `server/outputs/` and auto-deleted after 1 hour
- If `pdflatex` fails, the `.tex` source is still returned so you can compile it manually
- The LaTeX style matches your original template with pink code blocks and blue section headers
