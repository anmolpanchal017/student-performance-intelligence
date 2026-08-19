import pandas as pd
import joblib

from analytics.manual_analysis import get_manual_analysis
from llm.insight_generator import generate_ai_insight


# ---------------------------------
# Load trained model
# ---------------------------------

def load_risk_model(model_path):
    """
    Load trained Joblib model.
    """
    return joblib.load(model_path)


# ---------------------------------
# Create ML features
# ---------------------------------

def create_manual_features(manual_df, analytics_result):
    """
    Create the exact feature format expected
    by the trained Logistic Regression model.
    """

    feature_df = pd.DataFrame([{

        "avg_score":
            analytics_result["overall_score"],

        "avg_accuracy":
            analytics_result["overall_accuracy"],

        "avg_time_taken":
            manual_df["time_taken"].mean(),

        "total_attempts":
            len(manual_df),

        "trend_difference":
            analytics_result["trend_difference"]

    }])

    return feature_df


# ---------------------------------
# Build complete manual prediction
# ---------------------------------

def build_manual_service(manual_df, model_path):
    """
    Complete pipeline for manually entered
    student data.

    Flow:
    Manual Data
        ↓
    Analytics
        ↓
    ML Prediction
        ↓
    LLM Insight
        ↓
    Final JSON
    """

    # ---------------------------------
    # Analytics
    # ---------------------------------

    analytics_result = get_manual_analysis(
        manual_df
    )

    if analytics_result is None:
        return None

    # ---------------------------------
    # ML Features
    # ---------------------------------

    feature_df = create_manual_features(
        manual_df,
        analytics_result
    )

    # ---------------------------------
    # Load model
    # ---------------------------------

    model = load_risk_model(
        model_path
    )

    probability = float(
        model.predict_proba(feature_df)[0][1]
    )

    if probability >= 0.70:
        risk_level = "High"

    elif probability >= 0.40:
        risk_level = "Medium"

    else:
        risk_level = "Low"

    # ---------------------------------
    # Prepare LLM input
    # ---------------------------------

    llm_input = {

        "student": {

            "student_id":
                analytics_result["student_id"],

            "student_name":
                analytics_result["student_name"],

            "class_id":
                analytics_result["class_id"]
        },

        "performance": {

            "overall_score":
                analytics_result["overall_score"],

            "overall_accuracy":
                analytics_result["overall_accuracy"]
        },

        "strengths": {

            "strongest_subject":
                analytics_result["strongest_subject"],

            "strongest_topic":
                analytics_result["strongest_topic"]
        },

        "weaknesses": {

            "weakest_subject":
                analytics_result["weakest_subject"],

            "weakest_topic":
                analytics_result["weakest_topic"]
        },

        "trend": {

            "status":
                analytics_result["trend"],

            "difference":
                analytics_result["trend_difference"]
        },

        "risk": {

            "level":
                risk_level,

            "probability":
                round(probability, 3)
        }
    }

    # ---------------------------------
    # Generate AI Insight
    # ---------------------------------

    ai_result = generate_ai_insight(
        llm_input,
        insight_type="student"
    )

    # ---------------------------------
    # Final Response
    # ---------------------------------

    return {

        "student": {

            "student_id":
                analytics_result["student_id"],

            "student_name":
                analytics_result["student_name"],

            "class_id":
                analytics_result["class_id"]
        },

        "analytics": {

            "overall_score":
                analytics_result["overall_score"],

            "overall_accuracy":
                analytics_result["overall_accuracy"],

            "subject_performance":
                analytics_result["subject_performance"],

            "topic_performance":
                analytics_result["topic_performance"],

            "strongest_subject":
                analytics_result["strongest_subject"],

            "weakest_subject":
                analytics_result["weakest_subject"],

            "strongest_topic":
                analytics_result["strongest_topic"],

            "weakest_topic":
                analytics_result["weakest_topic"],

            "trend":
                analytics_result["trend"],

            "trend_difference":
                analytics_result["trend_difference"]
        },

        "risk": {

            "probability":
                round(probability, 3),

            "level":
                risk_level
        },

        "ai_insight":
            ai_result
    }