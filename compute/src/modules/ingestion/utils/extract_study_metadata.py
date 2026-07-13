from typing import Any

from .dicom_date_to_iso import dicom_date_to_iso
from .get_modality import get_modality
from .normalize_dicom_value import normalize_dicom_value


def extract_study_metadata(metadata: dict[str, Any]) -> dict[str, Any]:
    return {
        "studyInstanceUID": metadata.get("Study Instance UID"),
        "studyId": metadata.get("Study ID"),
        "specificCharacterSet": normalize_dicom_value(
            metadata.get("Specific Character Set")
        ),
        "studyDateTime": dicom_date_to_iso(
            study_date=metadata.get("Study Date"),
            study_time=metadata.get("Study Time"),
        ),
        "modality": get_modality(metadata.get("Modality")),
        "institutionName": metadata.get("Institution Name"),
        "stationName": metadata.get("Station Name"),
        "manufacturer": metadata.get("Manufacturer"),
        "manufacturersModelName": metadata.get("Manufacturer's Model Name"),
        "referringPhysiciansName": metadata.get("Referring Physician's Name"),
        "description": metadata.get("Study Description"),
    }
