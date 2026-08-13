import streamlit as st
import requests


# =================================
# CONFIGURATION
# =================================

API_BASE_URL = "http://127.0.0.1:8000"


st.set_page_config(
    page_title="Student Performance Intelligence",
    page_icon="🎓",
    layout="wide"
)


# =================================
# API HELPER FUNCTIONS
# =================================

def get_student_data(student_id):
    """
    Fetch student analysis from FastAPI.
    """

    try:

        response = requests.get(
            f"{API_BASE_URL}/student/{student_id}",
            timeout=60
        )

        if response.status_code == 200:
            return response.json()

        if response.status_code == 404:
            return None

        st.error(
            f"API Error: {response.status_code}"
        )

        return None

    except requests.exceptions.ConnectionError:

        st.error(
            "Could not connect to FastAPI. "
            "Please make sure the backend is running."
        )

        return None

    except requests.exceptions.Timeout:

        st.error(
            "The request timed out. "
            "Please try again."
        )

        return None

    except Exception as e:

        st.error(
            f"Unexpected error: {e}"
        )

        return None


def get_class_data(class_id):
    """
    Fetch class analysis from FastAPI.
    """

    try:

        response = requests.get(
            f"{API_BASE_URL}/class/{class_id}",
            timeout=60
        )

        if response.status_code == 200:
            return response.json()

        if response.status_code == 404:
            return None

        st.error(
            f"API Error: {response.status_code}"
        )

        return None

    except requests.exceptions.ConnectionError:

        st.error(
            "Could not connect to FastAPI. "
            "Please make sure the backend is running."
        )

        return None

    except requests.exceptions.Timeout:

        st.error(
            "The request timed out. "
            "Please try again."
        )

        return None

    except Exception as e:

        st.error(
            f"Unexpected error: {e}"
        )

        return None


# =================================
# SIDEBAR
# =================================

st.sidebar.title(
    "🎓 Student Intelligence"
)

st.sidebar.write(
    "AI-powered academic performance "
    "intelligence system."
)

page = st.sidebar.radio(
    "Navigation",
    [
        "Student Analysis",
        "Class Analysis",
        "Manual Prediction"
    ]
)


# =================================
# STUDENT ANALYSIS
# =================================

if page == "Student Analysis":

    st.title(
        "🎓 Student Performance Intelligence"
    )

    st.caption(
        "AI-powered academic performance, "
        "risk prediction and personalized learning insights."
    )

    st.divider()

    # ---------------------------------
    # Student Input
    # ---------------------------------

    student_id = st.text_input(
        "Enter Student ID",
        placeholder="e.g. S001"
    )

    analyze_student = st.button(
        "Analyze Student",
        type="primary"
    )

    if analyze_student:

        if not student_id.strip():

            st.warning(
                "Please enter a student ID."
            )

        else:

            with st.spinner(
                "Analyzing student performance..."
            ):

                data = get_student_data(
                    student_id.strip()
                )

            if data is None:

                st.error(
                    "Student not found."
                )

            else:

                # -----------------------------
                # Extract Data
                # -----------------------------

                student = data["student"]
                analytics = data["analytics"]
                risk = data["risk"]
                ai_insight = data["ai_insight"]

                st.success(
                    "Student analysis generated successfully."
                )

                st.divider()

                # -----------------------------
                # Student Information
                # -----------------------------

                st.subheader(
                    f"👤 {student['student_name']}"
                )

                st.caption(
                    f"Student ID: {student['student_id']}  |  "
                    f"Class: {student['class_id']}"
                )

                st.divider()

                # -----------------------------
                # KPI Cards
                # -----------------------------

                col1, col2, col3, col4 = st.columns(4)

                with col1:

                    st.metric(
                        "Overall Score",
                        f"{analytics['overall_score']:.2f}%"
                    )

                with col2:

                    st.metric(
                        "Accuracy",
                        f"{analytics['overall_accuracy']:.2f}%"
                    )

                with col3:

                    risk_level = risk["level"]

                    st.metric(
                        "Risk Level",
                        risk_level
                    )

                    if risk_level.lower() == "high":

                        st.error(
                            "⚠️ High risk — immediate attention recommended."
                        )

                    elif risk_level.lower() == "medium":

                        st.warning(
                            "⚠️ Medium risk — monitor performance closely."
                        )

                    else:

                        st.success(
                            "✅ Low risk — performance is currently stable."
                        )

                with col4:

                    risk_probability = (
                        risk["probability"] * 100
                    )

                    st.metric(
                        "Risk Probability",
                        f"{risk_probability:.2f}%"
                    )

                st.divider()

                # -----------------------------
                # Performance Overview
                # -----------------------------

                st.subheader(
                    "📊 Performance Overview"
                )

                col1, col2 = st.columns(2)

                with col1:

                    st.markdown(
                        f"""
                        **Strongest Subject**

                        ### {analytics['strongest_subject']}

                        **Strongest Topic**

                        {analytics['strongest_topic']}
                        """
                    )

                with col2:

                    st.markdown(
                        f"""
                        **Weakest Subject**

                        ### {analytics['weakest_subject']}

                        **Weakest Topic**

                        {analytics['weakest_topic']}
                        """
                    )

                st.divider()

                # -----------------------------
                # Trend
                # -----------------------------

                st.subheader(
                    "📈 Performance Trend"
                )

                col1, col2 = st.columns(2)

                with col1:

                    st.metric(
                        "Current Trend",
                        analytics["trend"],
                        delta=analytics[
                            "trend_difference"
                        ]
                    )

                with col2:

                    trend_difference = (
                        analytics["trend_difference"]
                    )

                    if trend_difference > 0:

                        st.success(
                            f"Performance improved by "
                            f"{trend_difference:.2f} points."
                        )

                    elif trend_difference < 0:

                        st.warning(
                            f"Performance decreased by "
                            f"{abs(trend_difference):.2f} points."
                        )

                    else:

                        st.info(
                            "Performance has remained stable."
                        )

                st.divider()

                

                # -----------------------------
                # Student Performance Chart
                # -----------------------------

                st.subheader(
                    "📊 Student Performance Snapshot"
                )

                chart_data = {
                    "Metric": [
                        "Score",
                        "Accuracy"
                    ],
                    "Value": [
                        analytics["overall_score"],
                        analytics["overall_accuracy"]
                    ]
                }

                st.bar_chart(
                    chart_data,
                    x="Metric",
                    y="Value"
                )

                st.divider()

                # ---------------------------------
                # Subject-wise Performance
                # ---------------------------------

                st.subheader(
                    "📚 Subject-wise Performance"
                )

                subject_performance = analytics[
                    "subject_performance"
                ]

                subject_chart_data = {
                    "Subject": list(
                        subject_performance.keys()
                    ),

                    "Score": list(
                        subject_performance.values()
                    )
                }

                st.bar_chart(
                    subject_chart_data,
                    x="Subject",
                    y="Score"
                )

                # ---------------------------------
                # Topic-wise Performance
                # ---------------------------------

                st.subheader(
                    "🎯 Topic-wise Performance"
                )

                topic_performance = analytics[
                    "topic_performance"
                ]

                topic_chart_data = {
                    "Topic": list(
                        topic_performance.keys()
                    ),

                    "Score": list(
                        topic_performance.values()
                    )
                }

                st.bar_chart(
                    topic_chart_data,
                    x="Topic",
                    y="Score"
                )


                # -----------------------------
                # AI Insight
                # -----------------------------

                st.subheader(
                    "🤖 AI Academic Insight"
                )

                insight = ai_insight["insight"]

                st.markdown(
                    "### Summary"
                )

                st.write(
                    insight["summary"]
                )

                st.markdown(
                    "### Explanation"
                )

                st.write(
                    insight["explanation"]
                )

                st.markdown(
                    "### Recommendation"
                )

                st.info(
                    insight["recommendation"]
                )

                

# =================================
# CLASS ANALYSIS
# =================================

elif page == "Class Analysis":

    st.title(
        "🏫 Class Performance Intelligence"
    )

    st.write(
        "AI-powered class-level performance "
        "analysis and learning insights."
    )

    st.divider()

    # ---------------------------------
    # Class Input
    # ---------------------------------

    class_id = st.text_input(
        "Enter Class ID",
        placeholder="e.g. 10A"
    )

    analyze_class = st.button(
        "Analyze Class",
        type="primary"
    )

    if analyze_class:

        if not class_id.strip():

            st.warning(
                "Please enter a class ID."
            )

        else:

            with st.spinner(
                "Analyzing class performance..."
            ):

                data = get_class_data(
                    class_id.strip()
                )

            if data is None:

                st.error(
                    "Class not found."
                )

            else:

                # -----------------------------
                # Extract Data
                # -----------------------------

                class_info = data["class"]
                analytics = data["analytics"]
                ai_insight = data["ai_insight"]

                st.success(
                    "Class analysis generated successfully."
                )

                st.divider()

                # -----------------------------
                # Class Information
                # -----------------------------

                st.subheader(
                    f"🏫 Class {class_info['class_id']}"
                )

                st.caption(
                    f"Total Students: "
                    f"{class_info['student_count']}"
                )

                st.divider()

                # -----------------------------
                # KPI Cards
                # -----------------------------

                col1, col2, col3 = st.columns(3)

                with col1:

                    st.metric(
                        "Class Average",
                        f"{analytics['class_average']:.2f}%"
                    )

                with col2:

                    st.metric(
                        "Class Accuracy",
                        f"{analytics['class_accuracy']:.2f}%"
                    )

                with col3:

                    st.metric(
                        "Performance Trend",
                        analytics["trend"],
                        delta=analytics[
                            "trend_difference"
                        ]
                    )

                st.divider()

               # -----------------------------
                # Subject Performance
                # -----------------------------

                st.subheader(
                    "📚 Subject Performance"
                )

                col1, col2 = st.columns(2)

                with col1:

                    st.success(
                        f"Strongest Subject: "
                        f"{analytics['strongest_subject']}"
                    )

                with col2:

                    st.warning(
                        f"Weakest Subject: "
                        f"{analytics['weakest_subject']}"
                    )


                subject_performance = analytics[
                    "subject_performance"
                ]

                subject_chart_data = {
                    "Subject": list(
                        subject_performance.keys()
                    ),

                    "Average Score": list(
                        subject_performance.values()
                    )
                }

                st.bar_chart(
                    subject_chart_data,
                    x="Subject",
                    y="Average Score"
                )

               # -----------------------------
                # Topic Performance
                # -----------------------------

                st.subheader(
                    "🎯 Topic-wise Performance"
                )

                topic_performance = analytics[
                    "topic_performance"
                ]

                topic_chart_data = {
                    "Topic": list(
                        topic_performance.keys()
                    ),

                    "Average Score": list(
                        topic_performance.values()
                    )
                }

                st.bar_chart(
                    topic_chart_data,
                    x="Topic",
                    y="Average Score"
                )

                # -----------------------------
                # Historical Trend
                # -----------------------------

                st.subheader(
                    "📈 Class Performance Trend"
                )

                col1, col2, col3 = st.columns(3)

                with col1:

                    st.metric(
                        "Earlier Average",
                        f"{analytics['earlier_average']:.2f}%"
                    )

                with col2:

                    st.metric(
                        "Recent Average",
                        f"{analytics['recent_average']:.2f}%"
                    )

                with col3:

                    st.metric(
                        "Change",
                        f"{analytics['trend_difference']:.2f}"
                    )

                # -----------------------------
                # Trend Chart
                # -----------------------------

                trend_data = {
                    "Period": [
                        "Earlier",
                        "Recent"
                    ],
                    "Average": [
                        analytics["earlier_average"],
                        analytics["recent_average"]
                    ]
                }

                st.bar_chart(
                    trend_data,
                    x="Period",
                    y="Average"
                )

                st.divider()

                # -----------------------------
                # AI Insight
                # -----------------------------

                st.subheader(
                    "🤖 AI Class Insight"
                )

                insight = ai_insight["insight"]

                st.markdown(
                    "### Summary"
                )

                st.write(
                    insight["summary"]
                )

                st.markdown(
                    "### Explanation"
                )

                st.write(
                    insight["explanation"]
                )

                st.markdown(
                    "### Recommendation"
                )

                st.info(
                    insight["recommendation"]
                )


elif page == "Manual Prediction":

    st.title("Manual Student Prediction")

    st.write(
        "Enter a student's assessment details "
        "to generate analytics, risk prediction "
        "and AI insights."
    )

    with st.form("manual_prediction_form"):

        col1, col2 = st.columns(2)

        with col1:
            student_id = st.text_input(
                "Student ID",
                "S999"
            )

            student_name = st.text_input(
                "Student Name",
                "Demo Student"
            )

            class_id = st.text_input(
                "Class ID",
                "10A"
            )

            subject = st.text_input(
                "Subject",
                "Mathematics"
            )

            topic = st.text_input(
                "Topic",
                "Probability"
            )

        with col2:

            assessment_name = st.text_input(
                "Assessment Name",
                "Unit Test"
            )

            marks_obtained = st.number_input(
                "Marks Obtained",
                min_value=0.0,
                value=18.0
            )

            total_marks = st.number_input(
                "Total Marks",
                min_value=1.0,
                value=20.0
            )

            attempt_date = st.date_input(
                "Attempt Date"
            )

            time_taken = st.number_input(
                "Time Taken (minutes)",
                min_value=1.0,
                value=25.0
            )

            questions_attempted = st.number_input(
                "Questions Attempted",
                min_value=1,
                value=20
            )

            questions_correct = st.number_input(
                "Questions Correct",
                min_value=0,
                value=18
            )

        submitted = st.form_submit_button(
            "Generate Prediction"
        )

    if submitted:

        payload = {
            "student_id": student_id,
            "student_name": student_name,
            "class_id": class_id,
            "subject": subject,
            "topic": topic,
            "assessment_name": assessment_name,
            "marks_obtained": marks_obtained,
            "total_marks": total_marks,
            "attempt_date": str(attempt_date),
            "time_taken": time_taken,
            "questions_attempted": questions_attempted,
            "questions_correct": questions_correct
        }

        response = requests.post(
            f"{API_BASE_URL}/manual-prediction",
            json=payload
        )

        if response.status_code == 200:

            result = response.json()

            st.success(
                "Prediction generated successfully!"
            )

            analytics = result["analytics"]
            risk = result["risk"]
            ai = result["ai_insight"]["insight"]

            st.subheader("Performance")

            c1, c2, c3 = st.columns(3)

            c1.metric(
                "Score",
                f"{analytics['overall_score']}%"
            )

            c2.metric(
                "Accuracy",
                f"{analytics['overall_accuracy']}%"
            )

            c3.metric(
                "Risk",
                risk["level"]
            )

            st.subheader("Strengths")

            st.write(
                f"**Subject:** "
                f"{analytics['strongest_subject']}"
            )

            st.write(
                f"**Topic:** "
                f"{analytics['strongest_topic']}"
            )

            st.subheader("Areas to Improve")

            st.write(
                f"**Subject:** "
                f"{analytics['weakest_subject']}"
            )

            st.write(
                f"**Topic:** "
                f"{analytics['weakest_topic']}"
            )

            st.subheader("Trend")

            st.write(
                analytics["trend"]
            )

            st.write(
                f"Difference: "
                f"{analytics['trend_difference']}"
            )

            st.subheader("AI Summary")

            st.write(
                ai["summary"]
            )

            st.subheader("Explanation")

            st.write(
                ai["explanation"]
            )

            st.subheader("Recommendation")

            st.write(
                ai["recommendation"]
            )

        else:

            st.error(
                "Prediction failed."
            )

            st.json(
                response.json()
            )