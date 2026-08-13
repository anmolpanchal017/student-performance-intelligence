from fastapi import FastAPI, HTTPException

from services.student_service import (
    build_student_service
)

from services.class_service import (
    build_class_service
)

from pydantic import BaseModel
import pandas as pd

from services.manual_service import build_manual_service


app = FastAPI(
    title="Student Performance Intelligence API",
    description="AI-powered student performance analytics API",
    version="1.0.0"
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


DATA_PATH = "data/raw_data.csv"
MODEL_PATH = "ml/risk_model.pkl"


@app.get("/")
def root():
    return {
        "message":
            "Student Performance Intelligence API is running"
    }


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
        "ml/risk_model.pkl"
    )

    return result