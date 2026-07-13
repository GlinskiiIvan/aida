from enum import Enum


class Modality(str, Enum):
    MR = "MR"
    CT = "CT"
    XR = "XR"
    US = "US"
