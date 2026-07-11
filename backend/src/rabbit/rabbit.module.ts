import { Module } from "@nestjs/common";

import { RabbitService } from "./rabbit.service";
import { RabbitStudyListener } from "./listeners/study.listener";
import { RabbitInferenceListener } from "./listeners/inference.listener";
import { IngestionModule } from "src/ingestion/ingestion.module";

@Module({
  imports: [
    IngestionModule,
  ],
  providers: [RabbitService, RabbitStudyListener, RabbitInferenceListener],
  exports: [RabbitService],
})
export class RabbitModule {}
