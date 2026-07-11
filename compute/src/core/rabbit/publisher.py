import json

import aio_pika

from . import connection
from . import setup_exchanges
from src.core.enums import rabbit


async def publish(
    routing_key: rabbit.RoutingKey,
    body: dict,
    exchange_name: rabbit.Exchange = rabbit.Exchange.EVENTS,
):
    if not connection.is_connected():
        await connection.connect()
        await setup_exchanges.setup()

    channel = connection.get_channel()

    exchange = await channel.get_exchange(exchange_name)

    await exchange.publish(
        aio_pika.Message(
            body=json.dumps(body, default=str).encode(),
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
        ),
        routing_key=routing_key,
    )
