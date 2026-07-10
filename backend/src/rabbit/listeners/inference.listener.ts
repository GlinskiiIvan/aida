import { Injectable, OnModuleInit } from "@nestjs/common";

import { RabbitService } from "../rabbit.service";

import { RabbitQueue } from "../rabbit.constants";

@Injectable()
export class RabbitInferenceListener implements OnModuleInit {
  constructor(private readonly rabbit: RabbitService) {}

  async onModuleInit() {
    const channel = this.rabbit.getChannel();

    await channel.consume(RabbitQueue.INFERENCE, async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;

      const body = JSON.parse(msg.content.toString());

      console.log("[INFERENCE]", routingKey, body);

      channel.ack(msg);
    });
  }
}
