import { Module, forwardRef } from "@nestjs/common";

import { RabbitService } from "./rabbit.service";
import { RabbitBackendListener } from "./listeners/backend.listener";
import { IngestionModule } from "src/ingestion/ingestion.module";
import { RabbitPublisher } from "./rabbit.publisher";
import { InferenceModule } from "src/inference/inference.module";
import { RabbitRpcService } from "./rabbit-rpc.service";

@Module({
  imports: [IngestionModule, forwardRef(() => InferenceModule)],
  providers: [RabbitService, RabbitRpcService, RabbitBackendListener, RabbitPublisher],
  exports: [RabbitService, RabbitRpcService, RabbitPublisher],
})
export class RabbitModule {}
