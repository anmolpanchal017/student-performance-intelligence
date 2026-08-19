import pandas as pd


def load_data(path):
    """
    Load assessment data from a CSV file.

    Parameters:
        path (str): Path to the CSV file.

    Returns:
        pd.DataFrame: Loaded assessment data.
    """

    df = pd.read_csv(path)

    return df


if __name__ == "__main__":

    df = load_data("data/raw_data.csv")

    print("Data loaded successfully!")
    print(f"Rows: {len(df)}")
    print(f"Columns: {len(df.columns)}")

    print("\nColumns:")
    print(df.columns.tolist())

    print("\nFirst 5 rows:")
    print(df.head())


def check_required_columns(df):
    """
    Check whether all required columns are present.
    """

    required_columns = [
        "student_id",
        "student_name",
        "class_id",
        "subject",
        "topic",
        "assessment_name",
        "marks_obtained",
        "total_marks",
        "attempt_date",
        "time_taken",
        "questions_attempted",
        "questions_correct"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    return True


def validate_data(df):
    """
    Validate assessment data and report data quality issues.

    Returns:
        dict: Validation report containing detected issues.
    """

    issues = {}

    # 1. Missing values
    missing_values = df.isnull().sum()
    missing_values = missing_values[
        missing_values > 0
    ].to_dict()

    issues["missing_values"] = missing_values

    # 2. Invalid marks
    invalid_marks = (
        df["marks_obtained"] > df["total_marks"]
    ).sum()

    issues["invalid_marks"] = int(invalid_marks)

    # 3. Invalid question counts
    invalid_questions = (
        df["questions_correct"]
        > df["questions_attempted"]
    ).sum()

    issues["invalid_questions"] = int(
        invalid_questions
    )

    # 4. Invalid dates
    parsed_dates = pd.to_datetime(
        df["attempt_date"],
        errors="coerce"
    )

    invalid_dates = parsed_dates.isna().sum()

    issues["invalid_dates"] = int(
        invalid_dates
    )

    # 5. Duplicate rows
    duplicate_rows = df.duplicated().sum()

    issues["duplicate_rows"] = int(
        duplicate_rows
    )

    return issues




if __name__ == "__main__":

    df = load_data("data/raw_data.csv")

    check_required_columns(df)

    print("Data loaded successfully!")
    print("All required columns are present.")
    print(f"Rows: {len(df)}")

    validation_report = validate_data(df)

    print("\nData Validation Report:")
    print(validation_report)


def load_and_process_data(file_path):
    """
    Load and perform basic preprocessing
    and feature engineering on student
    performance data.
    """

    df = pd.read_csv(file_path)

    # -------------------------
    # 1. Remove duplicate records
    # -------------------------

    df = df.drop_duplicates()

    # -------------------------
    # 2. Convert date column
    # -------------------------

    df["attempt_date"] = pd.to_datetime(
        df["attempt_date"],
        errors="coerce"
    )

    # Remove rows with invalid dates
    df = df.dropna(
        subset=["attempt_date"]
    )

    # -------------------------
    # 3. Calculate score percentage
    # -------------------------

    df["score_percentage"] = (
        df["marks_obtained"]
        / df["total_marks"].replace(0, pd.NA)
    ) * 100

    # -------------------------
    # 4. Calculate accuracy
    # -------------------------

    df["accuracy"] = (
        df["questions_correct"]
        / df["questions_attempted"].replace(0, pd.NA)
    ) * 100

    # -------------------------
    # 5. Sort records
    # -------------------------

    df = df.sort_values(
        ["student_id", "attempt_date"]
    ).reset_index(drop=True)

    return df