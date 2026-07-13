from src.core.enums.orientation import Orientation


def get_slice_orientation(orientation):
    if orientation == [1, 0, 0, 0, 1, 0]:
        return Orientation.AXIAL
    elif orientation == [0, 1, 0, 0, 0, -1]:
        return Orientation.SAGITTAL
    elif orientation == [1, 0, 0, 0, 0, -1]:
        return Orientation.CORONAL
    else:
        return Orientation.OBLIQUE_CUT


def get_slice_orientation_from_series_description(series_description: str):
    series_description = series_description.lower()

    if "tra" in series_description:
        return Orientation.AXIAL
    elif "sag" in series_description:
        return Orientation.SAGITTAL
    elif "cor" in series_description:
        return Orientation.CORONAL
    else:
        return Orientation.OBLIQUE_CUT
