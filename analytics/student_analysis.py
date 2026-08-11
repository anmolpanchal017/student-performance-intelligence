import pandas as pd

def get_student_analysis(
    student_id,
    df,
    student_features
):
    """
    Generate structured analytics for a single student.
    """

    student_df = df[
        df["student_id"] == student_id
    ].copy()

    if student_df.empty:
        return None

    student_df["attempt_date"] = pd.to_datetime(
        student_df["attempt_date"]
    )

    student_df = student_df.sort_values(
        "attempt_date"
    ).reset_index(drop=True)

    # Overall performance
    overall_score = student_df[
        "score_percentage"
    ].mean()

    overall_accuracy = student_df[
        "accuracy"
    ].mean()

    # Subject performance
    subject_performance = (
        student_df
        .groupby("subject")["score_percentage"]
        .mean()
    )

    strongest_subject = (
        subject_performance.idxmax()
    )

    weakest_subject = (
        subject_performance.idxmin()
    )

    # Topic performance
    topic_performance = (
        student_df
        .groupby("topic")["score_percentage"]
        .mean()
    )

    strongest_topic = (
        topic_performance.idxmax()
    )

    weakest_topic = (
        topic_performance.idxmin()
    )

    # ML features
    student_ml = student_features[
        student_features["student_id"] == student_id
    ]

    if student_ml.empty:
        return None

    student_ml = student_ml.iloc[0]

    return {
        "student_id": student_id,
        "student_name": student_df[
            "student_name"
        ].iloc[0],
        "class_id": student_df[
            "class_id"
        ].iloc[0],

        "overall_score": round(
            overall_score, 2
        ),

        "overall_accuracy": round(
            overall_accuracy, 2
        ),

        "strongest_subject":
            strongest_subject,

        "weakest_subject":
            weakest_subject,

        "strongest_topic":
            strongest_topic,

        "weakest_topic":
            weakest_topic,

        "topic_performance": {
            topic: round(
                float(score),
                2
            )
            for topic, score
            in topic_performance.items()
        },

        "subject_performance": {
            subject: round(
                float(score),
                2
            )
        for subject, score
        in subject_performance.items()
    },

        "trend":
            student_ml["trend"],

        "trend_difference":
            round(
                float(
                    student_ml[
                        "trend_difference"
                    ]
                ),
                2
            ),

        "risk_probability":
            round(
                float(
                    student_ml[
                        "risk_probability"
                    ]
                ),
                3
            ),

        "risk_level":
            student_ml[
                "risk_level"
            ]
    }