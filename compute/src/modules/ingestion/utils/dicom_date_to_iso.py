from datetime import datetime, timezone


def dicom_date_to_iso(study_date: str | None, study_time: str | None) -> str | None:
    if not study_date:
        return None

    # Дата
    year = int(study_date[0:4])
    month = int(study_date[4:6])
    day = int(study_date[6:8])

    # Время (по умолчанию 00:00:00)
    hours = 0
    minutes = 0
    seconds = 0

    if study_time:
        hours = int(study_time[0:2] or "0")
        minutes = int(study_time[2:4] or "0")
        seconds = int(study_time[4:6] or "0")

    # Создаем дату в UTC
    dt = datetime(
        year,
        month,
        day,
        hours,
        minutes,
        seconds,
        tzinfo=timezone.utc,
    )

    return dt.isoformat().replace("+00:00", "Z")
