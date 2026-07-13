import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib";

import { RabbitService } from "./rabbit.service";
import { RabbitExchange, RabbitRoutingKey } from "./rabbit.constants";

@Injectable()
export class RabbitPublisher {
  constructor(private readonly rabbit: RabbitService) {}

  async publish(
    routingKey: RabbitRoutingKey,
    body: unknown,
    exchange: RabbitExchange = RabbitExchange.EVENTS,
  ): Promise<void> {
    const channel = await this.rabbit.getChannel();

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(body)), {
      persistent: true,
      contentType: "application/json",
    });
  }
}
