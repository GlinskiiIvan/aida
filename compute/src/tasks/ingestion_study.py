import shutil
import asyncio

from celery import Task

from pathlib import Path
from src.core.enums.task import Task as TaskEnum
from src.core.enums.status import Status
from src.core.ws.publisher import publish_task

from src.modules.ingestion import service as ingestion_service
from .celery_app import celery

from src.modules.ingestion.schema import UploadStudyDTO


@celery.task(bind=True, name=TaskEnum.UPLOAD_STUDY)
def upload_study_task(
    self: Task,
    dto,
    archive_path: Path,
    upload_dir: Path,
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
        asyncio.run(
            ingestion_service.upload_study(
                dto=UploadStudyDTO(
                    task_id=task_id,
                    study_id=dto["study_id"],
                    study_path=Path(dto["study_path"]),
                    archive_path=archive_path,
                )
            )
        )
    finally:
        if upload_dir:
            shutil.rmtree(upload_dir, ignore_errors=True)
            print(f"CLEANED: {upload_dir}")

        publish_task(
            task_id=task_id,
            message={
                "task_id": task_id,
                "task_type": TaskEnum.UPLOAD_STUDY,
                "status": Status.COMPLETED,
            },
        )

        print(f"TASK {TaskEnum.UPLOAD_STUDY} FINISHED")
