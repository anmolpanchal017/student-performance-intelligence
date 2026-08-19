# 📝 Changelog

All notable changes to the **Student Performance Intelligence** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-08-19

### 🚀 Added
- **Modern React 19 Frontend**: Full migration from Streamlit to a Vite-powered React web application (`/client`).
- **Enterprise SaaS Design System**: Linear & Vercel-inspired light theme (`#F7F8FC`), crisp white cards with `#E2E8F0` borders, and typography powered by **Gilroy & Poppins**.
- **Interactive Visualizations**: Recharts integration for subject-wise performance bar charts, topic mastery distributions, and term comparison charts.
- **Dedicated AI Visual Identity (`AIInsightCard`)**: Custom `#F5F3FF` card identity with `#8B5CF6` accent icons and `#6D28D9` headers.
- **FastAPI CORS & Metadata Endpoints**: Added `CORSMiddleware`, `GET /students` autocomplete listing, and `GET /classes` metadata endpoints to FastAPI backend.
- **Manual Assessment Risk Predictor**: Form interface with "High Score" and "At Risk" presets for real-time machine learning risk classification.
- **Documentation Suite**: Added root `README.md`, `ARCHITECTURE.md`, `CHANGELOG.md`, and clean `.gitignore` configuration.

### 🧹 Removed
- **Legacy Streamlit App**: Deprecated Streamlit dependencies (`app.py`) in favor of the React frontend.

---

## [1.0.0] - 2026-08-01

### 🚀 Added
- **FastAPI Core Backend**: REST endpoints for student analysis (`GET /student/{student_id}`), class analysis (`GET /class/{class_id}`), and manual prediction (`POST /manual-prediction`).
- **Machine Learning Risk Model**: Scikit-Learn trained risk model (`risk_model.pkl`) evaluating student performance metrics.
- **Pandas Analytics Pipeline**: Student and class level data processing module (`processing.py`, `student_analysis.py`, `class_analysis.py`).
- **Groq LLM Integration**: Automated academic insight generation using Llama models with rule-based fallback logic.
