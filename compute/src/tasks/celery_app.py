import asyncio
from celery import Celery
from celery.signals import worker_process_init
from dotenv import load_dotenv

from src.core.config import REDIS_BROKER_URL
from src.core.config import REDIS_RESULT_BACKEND

load_dotenv()

if REDIS_BROKER_URL is None:
    raise RuntimeError("REDIS_BROKER_URL is not set")

if REDIS_RESULT_BACKEND is None:
    raise RuntimeError("REDIS_RESULT_BACKEND is not set")

celery = Celery("aida", broker=REDIS_BROKER_URL, backend=REDIS_RESULT_BACKEND)

celery.conf.update(
    worker_prefetch_multiplier=1,
    task_reject_on_worker_lost=True,
    task_acks_late=True,
    task_track_started=True,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
)

celery.autodiscover_tasks(["src.tasks"])
