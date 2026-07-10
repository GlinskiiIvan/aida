import json
import redis

from src.core.config import REDIS_BROKER_URL

if REDIS_BROKER_URL is None:
    raise RuntimeError("REDIS_BROKER_URL is not set")

redis_client = redis.from_url(REDIS_BROKER_URL)


def publish_task(task_id: str, message: dict):
    redis_client.publish(
        f"task:{task_id}",
        json.dumps(message),
    )
