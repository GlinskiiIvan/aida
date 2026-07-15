from pydantic import BaseModel
from pathlib import Path


class UploadStudyDTO(BaseModel):
    task_id: str
    study_id: int
    study_path: Path
    archive_path: Path
