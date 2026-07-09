import shutil

from celery import Task

from pathlib import Path
from core.enums.task import Task as TaskEnum
from core.enums.status import Status

from src.modules.ingestion import service as ingestion_service
from src.modules.ws.publisher import publish_task
from .celery_app import celery

from src.modules.ingestion.schema import UploadStudyDTO


@celery.task(bind=True, name=TaskEnum.UPLOAD_STUDY)
async def upload_study_task(
    self: Task,
    dto,
    archive_path: Path,
    upload_dir: str,
):
    task_id = self.request.id

    publish_task(
        task_id=task_id,
        message={
            "task_id": task_id,
            "task_type": TaskEnum.UPLOAD_STUDY,
            "status": Status.PENDING,
        },
    )
    print(f"TASK {TaskEnum.UPLOAD_STUDY} STARTED")

    try:
        await ingestion_service.upload_study(
            dto=UploadStudyDTO(
                task_id=task_id,
                study_id=dto["study_id"],
                study_path=dto["study_path"],
                archive_path=archive_path,
            )
        )
    finally:
        if upload_dir:
            shutil.rmtree(upload_dir, ignore_errors=True)
            print(f"CLEANED: {upload_dir}")

        print(f"TASK {TaskEnum.UPLOAD_STUDY} FINISHED")
