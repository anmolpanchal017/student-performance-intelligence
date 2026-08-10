import random

from datetime import datetime, timedelta

import pandas as pd

# Reproducibility ke liye
random.seed(42)


# --------------------------------------------------
# 1. Students
# --------------------------------------------------

STUDENT_NAMES = [
    "Aarav", "Vivaan", "Aditya", "Arjun", "Rohan",
    "Rahul", "Aryan", "Kabir", "Ishaan", "Ansh",
    "Krishna", "Dev", "Yash", "Kunal", "Harsh",
    "Ananya", "Diya", "Aanya", "Isha", "Meera",
    "Priya", "Riya", "Sneha", "Kavya", "Nisha",
    "Pooja", "Simran", "Muskan", "Shreya", "Tanya",
    "Neha", "Sakshi", "Anjali", "Palak", "Ritika",
    "Ayush", "Manav", "Dhruv", "Ved", "Vihaan",
    "Rudra", "Atharv", "Parth", "Shivansh", "Mohit",
    "Sahil", "Abhishek", "Varun", "Aman", "Nikhil",
    "Raj", "Vansh", "Sarthak", "Akash", "Pranav",
    "Lakshya", "Tushar", "Deepak", "Rajat", "Gaurav"
]


STUDENTS = [
    {
        "student_id": f"S{i + 1:03d}",
        "student_name": name,
        "class_id": f"10{chr(65 + (i // 20))}"
    }
    for i, name in enumerate(STUDENT_NAMES)
]


# --------------------------------------------------
# 2. Subjects and Topics
# --------------------------------------------------

SUBJECT_TOPICS = {
    "Physics": [
        "Mechanics",
        "Current Electricity",
        "Optics",
        "Thermodynamics"
    ],

    "Mathematics": [
        "Algebra",
        "Calculus",
        "Probability",
        "Geometry"
    ],

    "Chemistry": [
        "Organic Chemistry",
        "Inorganic Chemistry",
        "Chemical Bonding",
        "Thermodynamics"
    ],

    "Computer Science": [
        "Data Structures",
        "DBMS",
        "Operating Systems",
        "Computer Networks"
    ]
}


# --------------------------------------------------
# 3. Student Archetypes
# --------------------------------------------------

ARCHETYPES = (
    ["improving"] * 15
    + ["declining"] * 15
    + ["strong"] * 15
    + ["topic_weak"] * 10
    + ["inconsistent"] * 5
)

# Shuffle so archetypes aren't simply:
# S001-S015 = improving, etc.
random.shuffle(ARCHETYPES)


# --------------------------------------------------
# 4. Assign archetype to each student
# --------------------------------------------------

for student, archetype in zip(STUDENTS, ARCHETYPES):
    student["archetype"] = archetype


# --------------------------------------------------
# 6. Generate performance score
# --------------------------------------------------

def generate_base_score(archetype, assessment_number):
    """
    Generate a score based on the student's performance archetype.
    """

    if archetype == "improving":
        # Starts average and gradually improves
        base_score = 50 + (assessment_number * 3)

    elif archetype == "declining":
        # Starts good and gradually declines
        base_score = 85 - (assessment_number * 3)

    elif archetype == "strong":
        # Consistently high performer
        base_score = 84

    elif archetype == "topic_weak":
        # Overall performance remains reasonable.
        # Topic-specific weakness will be applied later.
        base_score = 72

    else:  # inconsistent
        # Random performance
        base_score = random.randint(45, 85)

    # Add realistic random variation
    noise = random.uniform(-5, 5)

    score = base_score + noise

    # Keep score within realistic limits
    return max(25, min(95, score))


# --------------------------------------------------
# 7. Generate assessment records
# --------------------------------------------------

def generate_assessment_records():
    records = []

    start_date = datetime(2026, 7, 1)

    assessment_count = 10

    for student in STUDENTS:

        student_id = student["student_id"]
        student_name = student["student_name"]
        class_id = student["class_id"]
        archetype = student["archetype"]

        for assessment_number in range(1, assessment_count + 1):

            # Randomly select subject
            subject = random.choice(list(SUBJECT_TOPICS.keys()))

            # Select topic from the selected subject
            topic = random.choice(SUBJECT_TOPICS[subject])

            # Generate assessment date
            attempt_date = start_date + timedelta(
                days=(assessment_number - 1) * 6
                + random.randint(0, 2)
            )

            # Generate score percentage
            score_percentage = generate_base_score(
                archetype,
                assessment_number
            )

            # --------------------------------------------------
            # Topic-specific weakness
            # --------------------------------------------------

            if archetype == "topic_weak":

                # Each topic-weak student has one weak topic
                # determined from their student ID.
                weak_topic_index = (
                    int(student_id[1:]) % len(SUBJECT_TOPICS)
                )

                weak_subject = list(SUBJECT_TOPICS.keys())[
                    weak_topic_index
                ]

                weak_topic = SUBJECT_TOPICS[weak_subject][0]

                if topic == weak_topic:
                    score_percentage -= random.uniform(20, 30)

            # Keep score realistic
            score_percentage = max(
                20,
                min(95, score_percentage)
            )

            # --------------------------------------------------
            # Marks
            # --------------------------------------------------

            total_marks = 100

            marks_obtained = round(
                total_marks * score_percentage / 100
            )

            # --------------------------------------------------
            # Questions
            # --------------------------------------------------

            questions_attempted = random.randint(30, 50)

            accuracy = score_percentage / 100

            questions_correct = round(
                questions_attempted * accuracy
            )

            questions_correct = max(
                0,
                min(
                    questions_attempted,
                    questions_correct
                )
            )

            # --------------------------------------------------
            # Time taken
            # --------------------------------------------------

            time_taken = random.randint(25, 60)

            # --------------------------------------------------
            # Assessment name
            # --------------------------------------------------

            assessment_name = f"Assessment {assessment_number}"

            # --------------------------------------------------
            # Create record
            # --------------------------------------------------

            record = {
                "student_id": student_id,
                "student_name": student_name,
                "class_id": class_id,
                "subject": subject,
                "topic": topic,
                "assessment_name": assessment_name,
                "marks_obtained": marks_obtained,
                "total_marks": total_marks,
                "attempt_date": attempt_date.strftime("%Y-%m-%d"),
                "time_taken": time_taken,
                "questions_attempted": questions_attempted,
                "questions_correct": questions_correct
            }

            records.append(record)

    return records


# --------------------------------------------------
# 8. Inject intentional data quality issues
# --------------------------------------------------

def inject_dirty_data(df):
    """
    Intentionally inject data quality issues into the
    synthetic dataset for testing the validation pipeline.
    """

    df = df.copy()

    # ----------------------------------------------
    # 1. Missing values
    # ----------------------------------------------

    missing_indices = random.sample(
        list(df.index),
        6
    )

    df.loc[missing_indices[:3], "time_taken"] = None
    df.loc[missing_indices[3:], "topic"] = None

    # ----------------------------------------------
    # 2. Invalid marks
    # marks_obtained > total_marks
    # ----------------------------------------------

    invalid_marks_indices = random.sample(
        list(df.index),
        3
    )

    for index in invalid_marks_indices:
        df.loc[index, "marks_obtained"] = (
            df.loc[index, "total_marks"] + random.randint(5, 20)
        )

    # ----------------------------------------------
    # 3. Invalid dates
    # ----------------------------------------------

    invalid_date_indices = random.sample(
        list(df.index),
        3
    )

    invalid_dates = [
        "2026-99-99",
        "not-a-date",
        "2026/35/80"
    ]

    for index, invalid_date in zip(
        invalid_date_indices,
        invalid_dates
    ):
        df.loc[index, "attempt_date"] = invalid_date

    # ----------------------------------------------
    # 4. Duplicate rows
    # ----------------------------------------------

    duplicate_indices = random.sample(
        list(df.index),
        3
    )

    duplicate_rows = df.loc[duplicate_indices].copy()

    df = pd.concat(
        [df, duplicate_rows],
        ignore_index=True
    )

    # ----------------------------------------------
    # 5. Invalid question counts
    # questions_correct > questions_attempted
    # ----------------------------------------------

    invalid_question_indices = random.sample(
        list(df.index),
        3
    )

    for index in invalid_question_indices:

        attempted = df.loc[
            index,
            "questions_attempted"
        ]

        df.loc[
            index,
            "questions_correct"
        ] = attempted + random.randint(1, 5)

    # Shuffle rows so dirty records aren't grouped
    df = df.sample(
        frac=1,
        random_state=42
    ).reset_index(drop=True)

    return df

# --------------------------------------------------
# 5. Quick verification
# --------------------------------------------------
if __name__ == "__main__":

    records = generate_assessment_records()

    df = pd.DataFrame(records)

    # Inject intentional data quality issues
    df = inject_dirty_data(df)

    print("\nDataset generated successfully!")

    print(f"Total records: {len(df)}")
    print(f"Unique students: {df['student_id'].nunique()}")
    print(f"Unique subjects: {df['subject'].nunique()}")
    print(f"Unique topics: {df['topic'].nunique()}")
    print(f"Unique classes: {df['class_id'].nunique()}")

    print("\nDataset preview:")
    print(df.head())

    df.to_csv(
        "data/raw_data.csv",
        index=False
    )

    print("\nSaved to: data/raw_data.csv")