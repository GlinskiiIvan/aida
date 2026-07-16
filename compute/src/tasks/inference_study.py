import asyncio

from celery import Task

from src.core.enums.task import Task as TaskEnum
from src.core.enums.status import Status
from src.core.ws.publisher import publish_task
from src.core.rabbit import publisher as rabbit_publisher
from src.core.enums import rabbit

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
    print(f"DTO: {dto}")
    asyncio.run(
        rabbit_publisher.publish(
            routing_key=rabbit.RoutingKey.INFERENCE_PENDING,
            body={
                "requestId": dto["requestId"],
                "task_id": task_id,
                "status": "processing",
            },
        )
    )
    print(f"TASK {TaskEnum.INFERENCE_STUDY} STARTED")

    try:
        dto = schema.PredictionRunDTO.model_validate(dto)
        asyncio.run(
            inference_service.predict_study(
                task_id=task_id,
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
        publish_task(
            task_id=task_id,
            message={
                "task_id": task_id,
                "task_type": TaskEnum.INFERENCE_STUDY,
                "status": Status.FAILED,
                "error": str(e),
            },
        )
        print(f"TASK {TaskEnum.INFERENCE_STUDY} FAILED: {e}")

        raise
