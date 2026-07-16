from . import schema
from .predictions import detection

from src.core.rabbit import publisher as rabbit_publisher
from src.core.enums import rabbit


async def predict_study(task_id: str, dto: schema.PredictionRunDTO):
    result = []

    if dto.type == "det":
        result = detection.predict(
            task_id=task_id,
            run_id=dto.runId,
            model_name=dto.model_name,
            images=dto.images,
        )

    body = {"runId": dto.runId, "predictions": result}

    await rabbit_publisher.publish(
        routing_key=rabbit.RoutingKey.INFERENCE_COMPLETED, body=body
    )
