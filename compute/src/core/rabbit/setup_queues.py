import aio_pika

from .connection import get_channel

from src.core.enums import rabbit


async def setup():
    channel = get_channel()

    exchange = await channel.get_exchange(rabbit.Exchange.EVENTS)

    study_queue = await channel.declare_queue(
        rabbit.Queue.STUDY,
        durable=True,
    )

    inference_queue = await channel.declare_queue(
        rabbit.Queue.INFERENCE,
        durable=True,
    )

    await study_queue.bind(
        exchange,
        routing_key=rabbit.RoutingKey.STUDY_PENDING,
    )

    await inference_queue.bind(
        exchange,
        routing_key=rabbit.RoutingKey.INFERENCE_PENDING,
    )
