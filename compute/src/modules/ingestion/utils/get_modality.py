from src.core.enums.modality import Modality


def get_modality(value: str | None):
    if value is None:
        return None

    value = value.lower()

    if "mr" in value:
        return Modality.MR
    elif "ct" in value:
        return Modality.CT
    elif "xr" in value:
        return Modality.XR
    elif "us" in value:
        return Modality.US
    else:
        return None
