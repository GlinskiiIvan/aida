import { Injectable, OnApplicationBootstrap } from "@nestjs/common";

import { RabbitService } from "../rabbit.service";

import { RabbitQueue, RabbitRoutingKey } from "../rabbit.constants";
import { IngestionService } from "src/ingestion/ingestion.service";

@Injectable()
export class RabbitStudyListener implements OnApplicationBootstrap {
  constructor(
    private readonly rabbit: RabbitService,
    private readonly ingestionService: IngestionService,
  ) {}

  async onApplicationBootstrap() {
    const channel = await this.rabbit.getChannel();

    await channel.consume(RabbitQueue.STUDY, async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;
      const body = JSON.parse(msg.content.toString());

      switch(routingKey) {
        case RabbitRoutingKey.STUDY_COMPLETED:
          await this.ingestionService.completeStudyProcessing(body);
          break;
      }

      channel.ack(msg);
    });
  }
}
