import pandas as pd
from analytics.trend_analysis import calculate_trend_difference

def get_class_analysis(
    class_id,
    df
):
    """
    Generate structured analytics for a single class.
    """

    class_df = df[
        df["class_id"] == class_id
    ].copy()

    if class_df.empty:
        return None

    # Make sure dates are datetime
    class_df["attempt_date"] = pd.to_datetime(
        class_df["attempt_date"]
    )

    # Basic class metrics
    class_average = class_df[
        "score_percentage"
    ].mean()

    class_accuracy = class_df[
        "accuracy"
    ].mean()

    # Subject-wise performance
    subject_performance = (
        class_df
        .groupby("subject")["score_percentage"]
        .mean()
        .sort_values()
    )

    topic_performance = (
        class_df
        .groupby("topic")["score_percentage"]
        .mean()
    )

    strongest_subject = (
        subject_performance.idxmax()
    )

    weakest_subject = (
        subject_performance.idxmin()
    )

    # Topic-wise performance
    topic_performance = (
        class_df
        .groupby("topic")["score_percentage"]
        .mean()
        .sort_values()
    )

    strongest_topics = (
        topic_performance
        .tail(3)
        .sort_values(
            ascending=False
        )
        .index
        .tolist()
    )

    weakest_topics = (
        topic_performance
        .head(3)
        .index
        .tolist()
    )

    # Date-wise class performance
    class_daily_performance = (
        class_df
        .groupby("attempt_date")[
            "score_percentage"
        ]
        .mean()
        .sort_index()
    )

    # Trend
    trend_result = calculate_trend_difference(
    class_daily_performance
    )

    earlier_average = trend_result[
        "earlier_average"
    ]

    recent_average = trend_result[
        "recent_average"
    ]

    trend_difference = trend_result[
        "trend_difference"
    ]

    trend = trend_result[
        "trend"
    ]

    return {
        "class_id": class_id,

        "class_average": round(
            class_average, 2
        ),

        "class_accuracy": round(
            class_accuracy, 2
        ),

        "strongest_subject":
            strongest_subject,

        "weakest_subject":
            weakest_subject,

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

        "strongest_topics":
            strongest_topics,

        "weakest_topics":
            weakest_topics,

        "earlier_average": round(
            earlier_average, 2
        ),

        "recent_average": round(
            recent_average, 2
        ),

        "trend_difference": round(
            trend_difference, 2
        ),

        "trend": trend,

        "student_count":
            class_df[
                "student_id"
            ].nunique()
    }