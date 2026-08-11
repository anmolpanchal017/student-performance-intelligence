import pandas as pd

from analytics.processing import (
    load_and_process_data
)

from analytics.student_analysis import (
    get_student_analysis
)

from ml.prediction import (
    create_student_features,
    load_risk_model,
    predict_student_risk
)

from llm.insight_generator import (
    generate_ai_insight
)


def build_student_service(
    data_path,
    model_path,
    student_id
):
    """
    Build complete student-level response
    including analytics, ML risk and AI insight.
    """

    # -------------------------
    # 1. Load data
    # -------------------------

    df = load_and_process_data(
        data_path
    )

    # -------------------------
    # 2. Create ML features
    # -------------------------

    student_features = (
        create_student_features(df)
    )

    # -------------------------
    # 3. Load trained model
    # -------------------------

    model = load_risk_model(
        model_path
    )

    # -------------------------
    # 4. Generate predictions
    # -------------------------

    ml_predictions = predict_student_risk(
        student_features,
        model
    )

    # -------------------------
    # 5. Student analytics
    # -------------------------

    student_result = get_student_analysis(
        student_id,
        df,
        ml_predictions
    )

    if student_result is None:
        return None

    # -------------------------
    # 6. Prepare LLM input
    # -------------------------

    llm_input = {
        "student": {
            "student_id":
                student_result["student_id"],

            "student_name":
                student_result["student_name"],

            "class_id":
                student_result["class_id"]
        },

        "performance": {
            "overall_score":
                student_result["overall_score"],

            "overall_accuracy":
                student_result["overall_accuracy"]
        },

        "strengths": {
            "strongest_subject":
                student_result[
                    "strongest_subject"
                ],

            "strongest_topic":
                student_result[
                    "strongest_topic"
                ]
        },

        "weaknesses": {
            "weakest_subject":
                student_result[
                    "weakest_subject"
                ],

            "weakest_topic":
                student_result[
                    "weakest_topic"
                ]
        },

        "trend": {
            "status":
                student_result["trend"],

            "difference":
                student_result[
                    "trend_difference"
                ]
        },

        "risk": {
            "probability":
                student_result[
                    "risk_probability"
                ],

            "level":
                student_result[
                    "risk_level"
                ]
        }
    }

    # -------------------------
    # 7. Generate AI insight
    # -------------------------

    ai_result = generate_ai_insight(
        llm_input,
        insight_type="student"
    )

    # -------------------------
    # 8. Final response
    # -------------------------

    return {
        "student": {
            "student_id":
                student_result["student_id"],

            "student_name":
                student_result["student_name"],

            "class_id":
                student_result["class_id"]
        },

        "analytics": {
            "overall_score":
                student_result["overall_score"],

            "overall_accuracy":
                student_result[
                    "overall_accuracy"
                ],

            "strongest_subject":
                student_result[
                    "strongest_subject"
                ],

            "weakest_subject":
                student_result[
                    "weakest_subject"
                ],

            "topic_performance":
                student_result[
                    "topic_performance"
                ],

            "subject_performance":
                student_result[
                    "subject_performance"
                ],

            "strongest_topic":
                student_result[
                    "strongest_topic"
                ],

            "weakest_topic":
                student_result[
                    "weakest_topic"
                ],

            "trend":
                student_result["trend"],

            "trend_difference":
                student_result[
                    "trend_difference"
                ]
        },

        "risk": {
            "probability":
                student_result[
                    "risk_probability"
                ],

            "level":
                student_result["risk_level"]
        },

        "ai_insight": ai_result
    }