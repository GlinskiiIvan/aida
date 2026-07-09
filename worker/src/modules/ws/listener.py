import asyncio
import json

import redis.asyncio as redis

from src.core.config import REDIS_BROKER_URL
from .manager import ws_manager


async def redis_listener():
    if REDIS_BROKER_URL is None:
        raise RuntimeError("REDIS_BROKER_URL is not set")

    client = redis.from_url(REDIS_BROKER_URL)
    pubsub = client.pubsub()

    await pubsub.psubscribe("task:*")

    try:
        while True:
            message = await pubsub.get_message(
                ignore_subscribe_messages=True, timeout=1.0
            )

            if message is None:
                await asyncio.sleep(0.01)
                continue

            channel = message["channel"].decode()
            task_id = channel.split(":")[1]
            data = json.loads(message["data"])

            await ws_manager.send_personal_message(task_id, data)

    except asyncio.CancelledError:
        pass

    finally:
        await pubsub.aclose()
        await client.aclose()
