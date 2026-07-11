from typing import Any
from pydicom.dataset import Dataset

from .dicom_date_to_iso import dicom_date_to_iso


def extract_study_metadata(metadata: dict[str, Any]) -> dict[str, Any]:
    return {
        "studyInstanceUID": metadata.get("Study Instance UID"),
        "studyId": metadata.get("Study ID"),
        "specificCharacterSet": metadata.get("Specific Character Set"),
        "studyDateTime": dicom_date_to_iso(
            study_date=metadata.get("Study Date"),
            study_time=metadata.get("Study Time"),
        ),
        "modality": metadata.get("Modality"),
        "institutionName": metadata.get("Institution Name"),
        "stationName": metadata.get("Station Name"),
        "manufacturer": metadata.get("Manufacturer"),
        "manufacturersModelName": metadata.get("Manufacturer's Model Name"),
        "referringPhysiciansName": metadata.get("Referring Physician's Name"),
        "description": metadata.get("Study Description"),
    }
