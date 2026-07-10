import aio_pika

connection = None
channel = None


async def connect():

    global connection
    global channel

    connection = await aio_pika.connect_robust("amqp://admin:admin@rabbitmq/")

    channel = await connection.channel()

    await channel.set_qos(prefetch_count=10)


async def disconnect():

    if connection:
        await connection.close()


def get_channel():
    if channel is None:
        raise RuntimeError("RabbitMQ channel is not initialized")

    return channel
