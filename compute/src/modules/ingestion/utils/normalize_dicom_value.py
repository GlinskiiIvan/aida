from pydicom.multival import MultiValue


def normalize_dicom_value(value):
    if isinstance(value, (list, tuple, MultiValue)):
        return "\\".join(map(str, value))

    return value
