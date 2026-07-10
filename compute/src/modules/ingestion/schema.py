from pydantic import BaseModel
import uuid
from pathlib import Path


class UploadStudyDTO(BaseModel):
    task_id: str
    study_id: uuid.UUID
    study_path: Path
    archive_path: Path
