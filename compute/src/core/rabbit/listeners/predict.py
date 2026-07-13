from typing import cast
from celery import Task

from src.modules.inference import schema

from src.tasks.inference_study import inference_study_task


async def prediction_listener(body: dict):
    cast(Task, inference_study_task).delay(dto=body)
