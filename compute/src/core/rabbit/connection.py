import aio_pika

from src.core.config import RABBITMQ_URL

connection = None
channel = None


async def connect():

    global connection
    global channel

    connection = await aio_pika.connect_robust(RABBITMQ_URL)

    channel = await connection.channel()

    await channel.set_qos(prefetch_count=10)


async def disconnect():
    if connection:
        await connection.close()


def get_channel():
    if channel is None:
        raise RuntimeError("RabbitMQ channel is not initialized")
    return channel


def is_connected() -> bool:
    return (
        connection is not None
        and not connection.is_closed
        and channel is not None
        and not channel.is_closed
    )

