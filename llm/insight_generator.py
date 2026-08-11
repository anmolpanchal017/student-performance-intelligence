import os
import json

from dotenv import load_dotenv
from groq import Groq


load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

client = Groq(
    api_key=groq_api_key
)


def generate_fallback_insight(
    llm_input,
    insight_type="student"
):
    """
    Generate a rule-based fallback insight
    when the LLM/API is unavailable.
    """

    # -------------------------
    # STUDENT FALLBACK
    # -------------------------

    if insight_type == "student":

        student_name = (
            llm_input["student"]["student_name"]
        )

        overall_score = (
            llm_input["performance"]["overall_score"]
        )

        accuracy = (
            llm_input["performance"]["overall_accuracy"]
        )

        strongest_subject = (
            llm_input["strengths"]["strongest_subject"]
        )

        strongest_topic = (
            llm_input["strengths"]["strongest_topic"]
        )

        weakest_subject = (
            llm_input["weaknesses"]["weakest_subject"]
        )

        weakest_topic = (
            llm_input["weaknesses"]["weakest_topic"]
        )

        trend = (
            llm_input["trend"]["status"]
        )

        risk_level = (
            llm_input["risk"]["level"]
        )

        risk_probability = (
            llm_input["risk"]["probability"]
        )

        summary = (
            f"{student_name} has an overall score of "
            f"{overall_score:.2f}% with an accuracy of "
            f"{accuracy:.2f}%. The current performance "
            f"trend is {trend.lower()} and the predicted "
            f"risk level is {risk_level.lower()}."
        )

        explanation = (
            f"The student's strongest subject is "
            f"{strongest_subject}, with {strongest_topic} "
            f"being the strongest topic. The main area "
            f"requiring attention is {weakest_subject}, "
            f"particularly {weakest_topic}. The predicted "
            f"risk probability is "
            f"{risk_probability:.2f}."
        )

        recommendation = (
            f"Focus on improving {weakest_topic} within "
            f"{weakest_subject}. Continue practicing the "
            f"weaker areas while maintaining the current "
            f"strengths in {strongest_subject} and "
            f"{strongest_topic}."
        )

    # -------------------------
    # CLASS FALLBACK
    # -------------------------

    elif insight_type == "class":

        class_id = (
            llm_input["class"]["class_id"]
        )

        class_average = (
            llm_input["performance"]["class_average"]
        )

        class_accuracy = (
            llm_input["performance"]["class_accuracy"]
        )

        strongest_subject = (
            llm_input["strengths"]["strongest_subject"]
        )

        strongest_topics = (
            llm_input["strengths"]["strongest_topics"]
        )

        weakest_subject = (
            llm_input["weaknesses"]["weakest_subject"]
        )

        weakest_topics = (
            llm_input["weaknesses"]["weakest_topics"]
        )

        trend = (
            llm_input["trend"]["status"]
        )

        summary = (
            f"Class {class_id} has an average score of "
            f"{class_average:.2f}% with an average accuracy "
            f"of {class_accuracy:.2f}%. The overall "
            f"performance trend is {trend.lower()}."
        )

        explanation = (
            f"The class performs strongest in "
            f"{strongest_subject}, with the strongest "
            f"topics being "
            f"{', '.join(strongest_topics)}. "
            f"The main area requiring attention is "
            f"{weakest_subject}, particularly "
            f"{', '.join(weakest_topics)}."
        )

        recommendation = (
            f"The class should focus on improving "
            f"{weakest_subject}, especially the topics "
            f"{', '.join(weakest_topics)}. Teachers can "
            f"provide additional practice and targeted "
            f"support in these areas."
        )

    else:

        raise ValueError(
            f"Unsupported insight_type: {insight_type}"
        )

    return {
        "summary": summary,
        "explanation": explanation,
        "recommendation": recommendation
    }


def generate_ai_insight(
    llm_input,
    insight_type="student"
):
    """
    Generate AI-powered insight using Groq LLM.
    Falls back to rule-based insight if the LLM fails.
    """

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI academic performance "
                        "assistant. Return valid JSON only."
                    )
                },

                {
                    "role": "user",
                    "content": f"""
You are an AI academic performance assistant.

Analyze the following structured
{insight_type} performance data:

{json.dumps(llm_input, indent=2)}

Return exactly this JSON structure:

{{
    "summary": "...",
    "explanation": "...",
    "recommendation": "..."
}}

Rules:
- Use only the provided data.
- Do not invent facts.
- Do not recalculate metrics.
- Keep recommendations actionable.
- Return JSON only.
- If this is student data, provide student-focused insights.
- If this is class data, provide class-level insights.
- Do not mention information that is not present
  in the provided data.
"""
                }
            ],

            temperature=0.2
        )

        raw_output = (
            response
            .choices[0]
            .message
            .content
            .strip()
        )

        # Remove possible markdown/backtick formatting
        raw_output = (
            raw_output
            .strip("`")
            .strip()
        )

        insight = json.loads(
            raw_output
        )

        return {
            "source": "llm",
            "insight": insight
        }

    except Exception as e:

        print(
            f"LLM generation failed: {e}"
        )

        return {
            "source": "fallback",
            "insight": generate_fallback_insight(
                llm_input,
                insight_type
            )
        }