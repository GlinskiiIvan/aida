import { Injectable, OnApplicationBootstrap } from "@nestjs/common";

import { RabbitService } from "../rabbit.service";
import { RabbitQueue, RabbitRoutingKey } from "../rabbit.constants";
import { InferenceService } from "src/inference/inference.service";
import { IngestionService } from "src/ingestion/ingestion.service";
import { RabbitRpcService } from "../rabbit-rpc.service";

@Injectable()
export class RabbitBackendListener implements OnApplicationBootstrap {
  constructor(
    private readonly rabbit: RabbitService,
    private readonly rabbitRpc: RabbitRpcService,
    private readonly inferenceService: InferenceService,
    private readonly ingestionService: IngestionService,
  ) {}

  async onApplicationBootstrap() {
    const channel = await this.rabbit.getChannel();

    await channel.consume(RabbitQueue.BACKEND, async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;

      const body = JSON.parse(msg.content.toString());

      switch (routingKey) {
        case RabbitRoutingKey.INFERENCE_PENDING:
          this.rabbitRpc.resolve(body.requestId, body.task_id);
          break;
        case RabbitRoutingKey.INFERENCE_COMPLETED:
          await this.inferenceService.completeInferenceProcessing(body);
          break;
        case RabbitRoutingKey.STUDY_COMPLETED:
          await this.ingestionService.completeStudyProcessing(body);
          break;
      }

      channel.ack(msg);
    });
  }
}
