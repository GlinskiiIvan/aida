from typing import Any
from pydicom.dataset import Dataset

from .dicom_date_to_iso import dicom_date_to_iso


def extract_study_metadata(ds: Dataset) -> dict[str, Any]:
    return {
        "studyInstanceUID": getattr(ds, "Study Instance UID", None),
        "studyId": getattr(ds, "Study ID", None),
        "specificCharacterSet": getattr(ds, "Specific Character Set", None),
        "studyDateTime": dicom_date_to_iso(
            study_date=getattr(ds, "Study Date", None),
            study_time=getattr(ds, "Study Time", None),
        ),
        "modality": getattr(ds, "Modality", None),
        "institutionName": getattr(ds, "Institution Name", None),
        "stationName": getattr(ds, "Station Name", None),
        "manufacturer": getattr(ds, "Manufacturer", None),
        "manufacturersModelName": getattr(ds, "Manufacturer's Model Name", None),
        "referringPhysiciansName": getattr(ds, "Referring Physician's Name", None),
        "description": getattr(ds, "Study Description", None),
    }
