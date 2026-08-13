import pandas as pd


def get_manual_analysis(manual_df):
    """
    Generate analytics for manually entered student data.
    """

    if manual_df.empty:
        return None

    df = manual_df.copy()

    # -----------------------------
    # Calculated Columns
    # -----------------------------
    df["score_percentage"] = (
        df["marks_obtained"] / df["total_marks"]
    ) * 100

    df["accuracy"] = (
        df["questions_correct"] /
        df["questions_attempted"]
    ) * 100

    df["attempt_date"] = pd.to_datetime(
        df["attempt_date"],
        errors="coerce"
    )

    df = df.sort_values(
        "attempt_date"
    ).reset_index(drop=True)

    # -----------------------------
    # Overall Metrics
    # -----------------------------
    overall_score = df["score_percentage"].mean()
    overall_accuracy = df["accuracy"].mean()

    # -----------------------------
    # Subject Performance
    # -----------------------------
    subject_performance = (
        df.groupby("subject")["score_percentage"]
        .mean()
    )

    strongest_subject = subject_performance.idxmax()
    weakest_subject = subject_performance.idxmin()

    # -----------------------------
    # Topic Performance
    # -----------------------------
    topic_performance = (
        df.groupby("topic")["score_percentage"]
        .mean()
    )

    strongest_topic = topic_performance.idxmax()
    weakest_topic = topic_performance.idxmin()

    # -----------------------------
    # Trend Calculation
    # -----------------------------
    if len(df) >= 2:

        midpoint = len(df) // 2

        earlier_avg = (
            df.iloc[:midpoint]["score_percentage"]
            .mean()
        )

        recent_avg = (
            df.iloc[midpoint:]["score_percentage"]
            .mean()
        )

        trend_difference = (
            recent_avg - earlier_avg
        )

        if trend_difference > 2:
            trend = "Improving"

        elif trend_difference < -2:
            trend = "Declining"

        else:
            trend = "Stable"

    else:
        earlier_avg = overall_score
        recent_avg = overall_score
        trend_difference = 0
        trend = "Stable"

    # -----------------------------
    # Return Analytics
    # -----------------------------
    return {

        "student_id":
            df["student_id"].iloc[0],

        "student_name":
            df["student_name"].iloc[0],

        "class_id":
            df["class_id"].iloc[0],

        "overall_score":
            round(overall_score, 2),

        "overall_accuracy":
            round(overall_accuracy, 2),

        "subject_performance": {
            subject: round(float(score), 2)
            for subject, score
            in subject_performance.items()
        },

        "topic_performance": {
            topic: round(float(score), 2)
            for topic, score
            in topic_performance.items()
        },

        "strongest_subject":
            strongest_subject,

        "weakest_subject":
            weakest_subject,

        "strongest_topic":
            strongest_topic,

        "weakest_topic":
            weakest_topic,

        "trend":
            trend,

        "trend_difference":
            round(trend_difference, 2)
    }