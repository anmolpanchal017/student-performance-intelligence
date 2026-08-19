import joblib
import pandas as pd


def create_student_features(df):
    """
    Create student-level features required
    by the trained risk model.
    """

    student_features = (
        df
        .groupby("student_id")
        .agg(
            avg_score=(
                "score_percentage",
                "mean"
            ),

            avg_accuracy=(
                "accuracy",
                "mean"
            ),

            avg_time_taken=(
                "time_taken",
                "mean"
            ),

            total_attempts=(
                "student_id",
                "count"
            )
        )
        .reset_index()
    )

    # Calculate trend for each student
    trends = []

    for student_id, group in df.groupby(
        "student_id"
    ):

        group = group.sort_values(
            "attempt_date"
        )

        scores = (
            group[
                "score_percentage"
            ]
            .reset_index(drop=True)
        )

        midpoint = len(scores) // 2

        if midpoint == 0:

            trend_difference = 0

        else:

            earlier_avg = (
                scores
                .iloc[:midpoint]
                .mean()
            )

            recent_avg = (
                scores
                .iloc[midpoint:]
                .mean()
            )

            trend_difference = (
                recent_avg - earlier_avg
            )

        trends.append({
            "student_id": student_id,
            "trend_difference":
                trend_difference
        })

    trend_df = pd.DataFrame(
        trends
    )

    student_features = (
        student_features.merge(
            trend_df,
            on="student_id",
            how="left"
        )
    )

    return student_features



def load_risk_model(
    model_path
):
    """
    Load the trained Logistic Regression model.
    """

    return joblib.load(
        model_path
    )

def predict_student_risk(
    student_features,
    model
):
    """
    Generate risk probability and
    risk level for each student.
    """

    feature_columns = [
        "avg_score",
        "avg_accuracy",
        "avg_time_taken",
        "total_attempts",
        "trend_difference"
    ]

    X = student_features[
        feature_columns
    ]

    student_features = (
        student_features.copy()
    )

    student_features[
        "risk_probability"
    ] = model.predict_proba(X)[:, 1]

    student_features[
        "risk_level"
    ] = (
        student_features[
            "risk_probability"
        ]
        .apply(
            lambda probability:
                "High"
                if probability >= 0.70
                else (
                    "Medium"
                    if probability >= 0.40
                    else "Low"
                )
        )
    )

    student_features["trend"] = (
    student_features["trend_difference"]
    .apply(
        lambda difference:
            "Improving"
            if difference >= 5
            else (
                "Declining"
                if difference <= -5
                else "Stable"
            )
    )
)

    return student_features