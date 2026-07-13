import { Injectable, OnApplicationBootstrap } from "@nestjs/common";

import { RabbitService } from "../rabbit.service";
import { RabbitQueue, RabbitRoutingKey } from "../rabbit.constants";
import { InferenceService } from "src/inference/inference.service";

@Injectable()
export class RabbitInferenceListener implements OnApplicationBootstrap {
  constructor(
    private readonly rabbit: RabbitService,
    private readonly inferenceService: InferenceService,
  ) {}

  async onApplicationBootstrap() {
    const channel = await this.rabbit.getChannel();

    await channel.consume(RabbitQueue.INFERENCE, async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;

      const body = JSON.parse(msg.content.toString());

      switch (routingKey) {
        case RabbitRoutingKey.INFERENCE_COMPLETED:
          await this.inferenceService.completeInferenceProcessing(body);
          break;
      }

      channel.ack(msg);
    });
  }
}
