from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

from services.student_service import build_student_service
from services.class_service import build_class_service
from services.manual_service import build_manual_service

app = FastAPI(
    title="Student Performance Intelligence API",
    description="AI-powered student performance analytics API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ManualPredictionRequest(BaseModel):
    student_id: str
    student_name: str
    class_id: str
    subject: str
    topic: str
    assessment_name: str
    marks_obtained: float
    total_marks: float
    attempt_date: str
    time_taken: float
    questions_attempted: int
    questions_correct: int


from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = str(BASE_DIR / "data" / "raw_data.csv")
MODEL_PATH = str(BASE_DIR / "ml" / "risk_model.pkl")


@app.get("/")
def root():
    return {
        "message": "Student Performance Intelligence API is running"
    }


@app.get("/students")
def get_students_list():
    """Return a list of unique available students for search and dropdowns."""
    try:
        df = pd.read_csv(DATA_PATH)
        students = (
            df[["student_id", "student_name", "class_id"]]
            .drop_duplicates()
            .to_dict(orient="records")
        )
        return {"students": students}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/classes")
def get_classes_list():
    """Return a list of unique available classes."""
    try:
        df = pd.read_csv(DATA_PATH)
        classes = sorted(df["class_id"].dropna().unique().tolist())
        return {"classes": classes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/student/{student_id}")
def get_student(student_id: str):
    result = build_student_service(
        DATA_PATH,
        MODEL_PATH,
        student_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return result


@app.get("/class/{class_id}")
def get_class(class_id: str):
    result = build_class_service(
        DATA_PATH,
        class_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Class not found"
        )

    return result


@app.post("/manual-prediction")
def manual_prediction(request: ManualPredictionRequest):
    manual_df = pd.DataFrame([
        request.model_dump()
    ])

    result = build_manual_service(
        manual_df,
        MODEL_PATH
    )

    return result