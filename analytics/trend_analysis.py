def calculate_trend_difference(
    values,
    threshold=5
):
    """
    Calculate performance trend using
    earlier vs recent average.
    """

    midpoint = len(values) // 2

    if midpoint == 0:
        return {
            "earlier_average": None,
            "recent_average": None,
            "trend_difference": None,
            "trend": "Insufficient Data"
        }

    earlier_average = values[:midpoint].mean()
    recent_average = values[midpoint:].mean()

    trend_difference = (
        recent_average - earlier_average
    )

    if trend_difference >= threshold:
        trend = "Improving"

    elif trend_difference <= -threshold:
        trend = "Declining"

    else:
        trend = "Stable"

    return {
        "earlier_average": round(
            earlier_average, 2
        ),
        "recent_average": round(
            recent_average, 2
        ),
        "trend_difference": round(
            trend_difference, 2
        ),
        "trend": trend
    }