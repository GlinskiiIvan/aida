from enum import Enum


class Orientation(str, Enum):
    AXIAL = "axial"
    CORONAL = "eoronal"
    SAGITTAL = "sagittal"
    OBLIQUE_CUT = "oblique cut"
