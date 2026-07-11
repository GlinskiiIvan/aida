import pydicom

from pydicom.multival import MultiValue
from pydicom.valuerep import PersonName


def to_serializable(value):
    if isinstance(value, MultiValue):
        return [to_serializable(v) for v in value]
    if isinstance(value, PersonName):
        return str(value)
    if isinstance(value, (int, float, str)):
        return value
    if isinstance(value, (list, tuple)):
        return [to_serializable(v) for v in value]
    return str(value)


def get_attrs(file):
    image_data = {}
    ds = pydicom.dcmread(file)
    for element in ds:
        value = element.value
        if isinstance(value, bytes):
            continue
        value = to_serializable(value)

        if isinstance(value, list) and len(value) == 1:
            value = value[0]

        image_data[element.name] = value
    return image_data
