# 🏗️ System Architecture & Technical Specifications

**Student Performance Intelligence** is a multi-tier academic analytics platform combining Machine Learning risk classification, structured data processing, Groq LLM synthesis, and a modern React frontend connected to a FastAPI service layer.

---

## 📐 High-Level Architecture Diagram

```text
                               ┌──────────────────────────────────────────────┐
                               │           React 19 Web Client                │
                               │        (Vite 8, Tailwind v4, Recharts)       │
                               └──────────────────────┬───────────────────────┘
                                                      │ HTTP / REST (JSON)
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │             FastAPI Backend                  │
                               │          `api/main.py` + CORS                │
                               └──────┬──────────────────────────────┬────────┘
                                      │                              │
                   ┌──────────────────┴───────────────┐              │
                   ▼                                  ▼              ▼
┌─────────────────────────────────────┐   ┌───────────────────────────────┐
│          Service Layer              │   │   Metadata & Helper Routes    │
│  (`build_student_service`, etc.)    │   │  (`GET /students`, `/classes`) │
└──────────────────┬──────────────────┘   └───────────────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    ▼                             ▼
┌───────────────────────┐ ┌───────────────────────┐
│  Data Analytics       │ │ Machine Learning      │
│  (Pandas Processing)  │ │ (Scikit-Learn Model)  │
└───────────┬───────────┘ └───────────┬───────────┘
            │                         │
            └────────────┬────────────┘
                         ▼
┌─────────────────────────────────────────────────┐
│              Groq LLM Engine                    │
│   Insight Synthesizer + Fallback Generator      │
└─────────────────────────────────────────────────┘
```

---

## 🗂️ Architectural Layers

### 1. Presentation Layer (`/client`)
- **Technology Stack**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Recharts.
- **Design System**: Enterprise SaaS styling inspired by Linear & Vercel with Gilroy & Poppins typography.
- **State Management**: React `useState` & `useEffect` hook pipelines with decoupled API service abstractions (`services/api.ts`).
- **Core Modules**:
  - **Overview**: Landing dashboard with dataset stats and student/class quick-selection cards.
  - **Student Intelligence**: Comprehensive student profiles, overall scores, accuracy rates, risk metrics, subject/topic charts, and AI academic advice.
  - **Class Intelligence**: Classroom averages, student enrollment tracking, subject/topic distribution charts, and term comparisons.
  - **Manual Risk Predictor**: Form for submitting custom assessment scores with real-time risk predictions.

### 2. API Gateway & Service Layer (`/server/api` & `/server/services`)
- **Framework**: FastAPI hosted with Uvicorn on port `8000`.
- **CORS Middleware**: `fastapi.middleware.cors.CORSMiddleware` configured to allow requests from client origins.
- **Service Modules**:
  - `student_service.py`: Aggregates student analytics, runs ML risk model inferences, formats LLM prompts, and returns unified JSON payloads.
  - `class_service.py`: Computes classroom averages, subject distributions, historical term differences, and class-level pedagogical advice.
  - `manual_service.py`: Handles single-assessment manual risk score evaluations.

### 3. Data Processing & Analytics (`/server/analytics`)
- **Core Engine**: Pandas & NumPy pipelines in `processing.py`.
- **Operations**:
  - Data cleaning, duplicate elimination, date parsing, and invalid record handling.
  - Metrics computation: Overall percentage scores, attempt accuracy rates, strongest/weakest subjects, and topic mastery distributions.
  - Trend Analysis (`trend_analysis.py`): Compares earlier vs. recent student assessments to compute trajectory deltas.

### 4. Machine Learning Engine (`/server/ml`)
- **Model**: Trained Scikit-Learn classifier serialized via `joblib` (`risk_model.pkl`).
- **Feature Engineering** (`features.py`):
  - `avg_score`: Mean score percentage across historical assessments.
  - `avg_accuracy`: Ratio of correct questions to attempted questions.
  - `avg_time_taken`: Mean completion time in minutes.
  - `total_attempts`: Count of total completed assessments.
  - `trend_difference`: Score change trajectory delta.
- **Risk Categorization**:
  - Probability threshold mapping: **Low Risk** (< 35%), **Medium Risk** (35%–65%), **High Risk** (> 65%).

### 5. LLM Synthesis & Fallback Engine (`/server/llm`)
- **API Provider**: Groq API using Llama models.
- **Prompt Isolation**: Transmits structured numerical analytics to the LLM rather than raw student logs, ensuring privacy and fast token generation.
- **Structured Output**: Generates JSON containing `summary`, `explanation`, and `recommendation`.
- **Deterministic Fallback**: If the LLM API call times out or fails, `insight_generator.py` executes a rule-based fallback mechanism, guaranteeing 100% uptime.

---

## 🔄 Sequence Diagram (Student Query Lifecycle)

```text
User Client            FastAPI API          Student Service       ML / Analytics       Groq LLM Engine
    │                      │                      │                     │                     │
    │ ── GET /student/S001 ──>                    │                     │                     │
    │                      │ ── build_service ──> │                     │                     │
    │                      │                      │ ── load_data() ───> │                     │
    │                      │                      │ <── df_processed ── │                     │
    │                      │                      │ ── predict_risk() ─>│                     │
    │                      │                      │ <── risk_level ──── │                     │
    │                      │                      │ ── generate_ai() ────────────────────────>│
    │                      │                      │ <── ai_insight ───────────────────────────│
    │                      │ <── JSON Response ── │                     │                     │
    │ <── 200 OK (JSON) ── │                      │                     │                     │
```

---

## 🛡️ Security & Reliability Specifications

1. **CORS Isolation**: Restricts cross-origin resource sharing strictly to trusted frontend endpoints.
2. **LLM Fault Tolerance**: Automatic failover to deterministic insights prevents API failures from disrupting frontend rendering.
3. **Data Schema Validation**: Pydantic models validate input types for manual risk prediction calls (`ManualPredictionRequest`).
