# 🎓 Student Performance Intelligence

An AI-powered student performance analysis system that combines
data analytics, machine learning, and LLM-generated insights to
help understand student and class-level academic performance.

---

## 🚀 Overview

Student Performance Intelligence analyzes assessment data to provide:

- Student performance analytics
- Class-level performance analytics
- Subject-wise performance
- Topic-wise performance
- Performance trend analysis
- Student academic risk prediction
- AI-generated academic insights
- Personalized recommendations
- Interactive Streamlit dashboard
- FastAPI backend

The system follows a modular architecture where data processing,
analytics, machine learning, LLM generation, backend services,
and frontend presentation are separated into independent layers.

---

## ✨ Features

### 👨‍🎓 Student Analysis

For an individual student, the system provides:

- Overall score
- Overall accuracy
- Strongest subject
- Weakest subject
- Strongest topic
- Weakest topic
- Subject-wise performance
- Topic-wise performance
- Performance trend
- Risk probability
- Risk level
- AI-generated explanation
- Personalized recommendation

---

### 🏫 Class Analysis

For a class, the system provides:

- Number of students
- Class average
- Class accuracy
- Strongest subject
- Weakest subject
- Subject-wise performance
- Topic-wise performance
- Earlier vs recent performance
- Performance trend
- AI-generated class insights
- Class-level recommendations

---

## 🤖 Machine Learning

The project uses machine learning to predict student academic risk.

### Models Evaluated

The following models were compared:

- Logistic Regression
- Decision Tree
- Random Forest
- Support Vector Machine (SVM)

Model performance was evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score

After comparison and validation, the final model was selected based
on the evaluation results.

The trained model is stored using Joblib:

```text
ml/risk_model.pkl
ML Features

The risk model uses student-level features including:

avg_score
avg_accuracy
avg_time_taken
total_attempts
trend_difference
📊 Data Processing

The raw assessment data contains information such as:

student_id
student_name
class_id
subject
topic
assessment_name
marks_obtained
total_marks
attempt_date
time_taken
questions_attempted
questions_correct

The processing pipeline performs:

CSV loading
Duplicate removal
Date conversion
Invalid date handling
Score percentage calculation
Accuracy calculation
Data sorting
Student-level feature creation
📈 Analytics
Student Analytics

Student analytics calculate:

Overall performance
Accuracy
Subject performance
Topic performance
Strongest areas
Weakest areas
Performance trend
Class Analytics

Class analytics calculate:

Class average
Class accuracy
Subject performance
Topic performance
Strongest areas
Weakest areas
Historical performance trend
🧠 LLM Integration

The project uses Groq's LLM API to generate natural-language
academic insights.

The LLM receives structured analytical data rather than raw
student records.

It generates:

Summary
Explanation
Recommendation
Fallback Mechanism

If the LLM API fails or returns invalid output, the application
automatically generates a deterministic fallback insight.

This ensures that the application can still provide useful
recommendations even when the external LLM service is unavailable.

🏗️ Architecture
                    ┌──────────────────┐
                    │   Streamlit UI   │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │     FastAPI      │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                ↓                         ↓
        Student Service             Class Service
                │                         │
                ↓                         ↓
        ┌───────────────┐        ┌───────────────┐
        │   Analytics   │        │   Analytics   │
        └───────┬───────┘        └───────┬───────┘
                │                        │
                ↓                        ↓
        ┌───────────────┐        ┌───────────────┐
        │ ML Prediction │        │   LLM Insight │
        └───────┬───────┘        └───────┬───────┘
                │                        │
                └────────────┬───────────┘
                             ↓
                    ┌──────────────────┐
                    │  JSON Response   │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │   Streamlit UI   │
                    └──────────────────┘
📁 Project Structure
student-performance-intelligence/
│
├── api/
│   ├── __init__.py
│   └── main.py
│
├── analytics/
│   ├── __init__.py
│   ├── processing.py
│   ├── student_analysis.py
│   ├── class_analysis.py
│   └── trend_analysis.py
│
├── ml/
│   ├── __init__.py
│   ├── prediction.py
│   └── risk_model.pkl
│
├── llm/
│   ├── __init__.py
│   └── insight_generator.py
│
├── services/
│   ├── __init__.py
│   ├── student_service.py
│   └── class_service.py
│
├── streamlit_app/
│   └── app.py
│
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── ...
│   └── final_model.ipynb
│
├── data/
│   └── raw_data.csv
│
├── .env
├── .gitignore
├── requirements.txt
└── README.md
🔌 API Endpoints

Health Check
GET /

Get All Students List
GET /students

Get All Classes List
GET /classes

Student Analysis
GET /student/{student_id}
Example: /student/S001

Class Analysis
GET /class/{class_id}
Example: /class/10A

Manual Assessment Risk Prediction
POST /manual-prediction

Interactive API documentation is available through FastAPI Swagger:
http://127.0.0.1:8000/docs

▶️ Running the Server

Start FastAPI:
python -m uvicorn api.main:app --reload --port 8000

FastAPI will run at:
http://127.0.0.1:8000

For the modern React application, see the client/ directory (`cd ../client && npm run dev`).

🧪 Development Workflow

Data exploration, machine learning experimentation,
feature engineering, model comparison, and LLM testing
are performed in Jupyter notebooks.

Production/application logic is maintained in Python modules.

This separation allows experimentation without coupling
the application to notebook execution.

🛠️ Tech Stack
Programming
Python
Data Science
Pandas
NumPy
Scikit-learn
Machine Learning
Logistic Regression
Decision Tree
Random Forest
SVM
Joblib
Backend
FastAPI
Uvicorn
AI / LLM
Groq API
Llama model
Frontend
Streamlit
Development
Jupyter Notebook
VS Code
Git
GitHub
🔒 Reliability

The system includes:

Invalid date handling
Duplicate removal
Missing-data handling
Student/class not-found handling
API timeout handling
LLM failure fallback
Invalid LLM JSON handling
Environment variable based API-key management
📌 Future Improvements

Potential future improvements include:

Teacher authentication
Student authentication
Historical performance graphs
Student comparison
Class ranking
Early-warning notifications
Automated teacher reports
PDF report generation
Database integration
Advanced model tuning
Model monitoring
Deployment on cloud infrastructure
👨‍💻 Author

Anmol Panchal

B.Tech Computer Science Engineering

Interested in:

Artificial Intelligence
Machine Learning
Data Science
Software Development
📄 License

This project is developed for educational,
portfolio, and academic purposes.