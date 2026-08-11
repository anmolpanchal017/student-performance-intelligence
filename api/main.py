from fastapi import FastAPI, HTTPException

from services.student_service import (
    build_student_service
)

from services.class_service import (
    build_class_service
)


app = FastAPI(
    title="Student Performance Intelligence API",
    description="AI-powered student performance analytics API",
    version="1.0.0"
)


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