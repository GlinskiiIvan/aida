import json

from aio_pika import IncomingMessage

from . import connection
from . import setup_exchanges


async def consume(
    queue,
    routing_key,
    callback,
    exchange,
):
    if not connection.is_connected():
        await connection.connect()
        await setup_exchanges.setup()

    channel = connection.get_channel()

    exchange = await channel.get_exchange(exchange)

    queue = await channel.declare_queue(
        queue,
        durable=True,
    )

    await queue.bind(
        exchange,
        routing_key=routing_key,
    )

    async def wrapper(message: IncomingMessage):
        async with message.process():
            body = json.loads(message.body)

            await callback(body)

    await queue.consume(wrapper)
