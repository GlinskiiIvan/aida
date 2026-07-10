import aio_pika

from .connection import get_channel

from src.core.enums import rabbit


async def setup():
    channel = get_channel()

    await channel.declare_exchange(
        rabbit.Exchange.EVENTS,
        aio_pika.ExchangeType.TOPIC,
        durable=True,
    )
