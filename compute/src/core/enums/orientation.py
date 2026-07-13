from enum import Enum


class Orientation(str, Enum):
    AXIAL = "axial"
    CORONAL = "coronal"
    SAGITTAL = "sagittal"
    OBLIQUE_CUT = "oblique cut"
