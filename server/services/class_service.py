from analytics.processing import (
    load_and_process_data
)

from analytics.class_analysis import (
    get_class_analysis
)

from llm.insight_generator import (
    generate_ai_insight
)


def build_class_service(
    data_path,
    class_id
):
    """
    Build complete class-level response
    including analytics and AI insight.
    """

    # -------------------------
    # 1. Load processed data
    # -------------------------

    df = load_and_process_data(
        data_path
    )

    # -------------------------
    # 2. Class analytics
    # -------------------------

    class_result = get_class_analysis(
        class_id,
        df
    )

    if class_result is None:
        return None

    # -------------------------
    # 3. Prepare LLM input
    # -------------------------

    class_llm_input = {
        "class": {
            "class_id":
                class_result["class_id"],

            "student_count":
                class_result["student_count"]
        },

        "performance": {
            "class_average":
                class_result["class_average"],

            "class_accuracy":
                class_result["class_accuracy"]
        },

        "strengths": {
            "strongest_subject":
                class_result[
                    "strongest_subject"
                ],

            "strongest_topics":
                class_result[
                    "strongest_topics"
                ]
        },

        "weaknesses": {
            "weakest_subject":
                class_result[
                    "weakest_subject"
                ],

            "weakest_topics":
                class_result[
                    "weakest_topics"
                ]
        },

        "trend": {
            "earlier_average":
                class_result[
                    "earlier_average"
                ],

            "recent_average":
                class_result[
                    "recent_average"
                ],

            "difference":
                class_result[
                    "trend_difference"
                ],

            "status":
                class_result["trend"]
        }
    }

    # -------------------------
    # 4. Generate AI insight
    # -------------------------

    ai_result = generate_ai_insight(
        class_llm_input,
        insight_type="class"
    )

    # -------------------------
    # 5. Final response
    # -------------------------

    return {
        "class": {
            "class_id":
                class_result["class_id"],

            "student_count":
                class_result["student_count"]
        },

        "analytics": {
            "class_average":
                class_result[
                    "class_average"
                ],

            "class_accuracy":
                class_result[
                    "class_accuracy"
                ],

            "strongest_subject":
                class_result[
                    "strongest_subject"
                ],

            "weakest_subject":
                class_result[
                    "weakest_subject"
                ],

            "topic_performance":
                class_result[
                    "topic_performance"
                ],

            "subject_performance":
                class_result[
                    "subject_performance"
                ],

            "strongest_topics":
                class_result[
                    "strongest_topics"
                ],

            "weakest_topics":
                class_result[
                    "weakest_topics"
                ],

            "earlier_average":
                class_result[
                    "earlier_average"
                ],

            "recent_average":
                class_result[
                    "recent_average"
                ],

            "trend_difference":
                class_result[
                    "trend_difference"
                ],

            "trend":
                class_result["trend"]
        },

        "ai_insight": ai_result
    }