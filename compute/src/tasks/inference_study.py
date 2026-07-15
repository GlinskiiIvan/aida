import asyncio

from celery import Task

from src.core.enums.task import Task as TaskEnum
from src.core.enums.status import Status
from src.core.ws.publisher import publish_task

from src.modules.inference import service as inference_service
from .celery_app import celery

from src.modules.inference import schema


@celery.task(bind=True, name=TaskEnum.INFERENCE_STUDY)
def inference_study_task(
    self: Task,
    dto,
):
    task_id = self.request.id

    publish_task(
        task_id=task_id,
        message={
            "task_id": task_id,
            "task_type": TaskEnum.INFERENCE_STUDY,
            "status": Status.PENDING,
        },
    )
    print(f"TASK {TaskEnum.INFERENCE_STUDY} STARTED")

    try:
        dto = schema.PredictionRunDTO.model_validate(dto)
        asyncio.run(
            inference_service.predict_study(
                dto=dto,
            )
        )

        publish_task(
            task_id=task_id,
            message={
                "task_id": task_id,
                "task_type": TaskEnum.INFERENCE_STUDY,
                "status": Status.COMPLETED,
            },
        )

        print(f"TASK {TaskEnum.UPLOAD_STUDY} FINISHED")
    except Exception as e:
        print(f"TASK {TaskEnum.INFERENCE_STUDY} FAILED: {e}")

        publish_task(
            task_id=task_id,
            message={
                "task_id": task_id,
                "task_type": TaskEnum.INFERENCE_STUDY,
                "status": Status.FAILED,
                "error": str(e),
            },
        )

        raise
