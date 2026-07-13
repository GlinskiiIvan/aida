from src.core.enums import rabbit
from src.core.rabbit import consumer as rabbit_consumer
from src.core.rabbit.listeners import predict as inference_study


async def setup():
    await rabbit_consumer.consume(
        queue=rabbit.Queue.INFERENCE,
        routing_key=rabbit.RoutingKey.INFERENCE_PENDING,
        exchange=rabbit.Exchange.EVENTS,
        callback=inference_study.prediction_listener,
    )
