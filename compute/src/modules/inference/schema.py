from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class PredictionType(str, Enum):
    DET = "det"
    SEG = "seg"


class PredictionImageDTO(BaseModel):
    id: int
    path: str


class PredictionRunDTO(BaseModel):
    runId: int
    type: PredictionType
    model_name: str
    images: list[PredictionImageDTO]
