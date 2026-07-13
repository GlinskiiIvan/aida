import { Module, forwardRef } from "@nestjs/common";

import { RabbitService } from "./rabbit.service";
import { RabbitStudyListener } from "./listeners/study.listener";
import { RabbitInferenceListener } from "./listeners/inference.listener";
import { IngestionModule } from "src/ingestion/ingestion.module";
import { RabbitPublisher } from "./rabbit.publisher";
import { InferenceModule } from "src/inference/inference.module";

@Module({
  imports: [IngestionModule, forwardRef(() => InferenceModule)],
  providers: [RabbitService, RabbitStudyListener, RabbitInferenceListener, RabbitPublisher],
  exports: [RabbitService, RabbitPublisher],
})
export class RabbitModule {}
