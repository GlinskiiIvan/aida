import { Injectable, OnApplicationBootstrap } from "@nestjs/common";

import { RabbitService } from "../rabbit.service";

import { RabbitQueue } from "../rabbit.constants";

@Injectable()
export class RabbitStudyListener implements OnApplicationBootstrap {
  constructor(private readonly rabbit: RabbitService) {}

  async onApplicationBootstrap() {
    const channel = await this.rabbit.getChannel();

    await channel.consume(RabbitQueue.STUDY, async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;

      const body = JSON.parse(msg.content.toString());

      console.log("[STUDY]", routingKey, body);

      channel.ack(msg);
    });
  }
}
