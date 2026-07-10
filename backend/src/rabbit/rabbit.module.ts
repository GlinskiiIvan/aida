import { Module } from "@nestjs/common";

import { RabbitService } from "./rabbit.service";
import { RabbitStudyListener } from "./listeners/study.listener";
import { RabbitInferenceListener } from "./listeners/inference.listener";

@Module({
  providers: [RabbitService, RabbitStudyListener, RabbitInferenceListener],
  exports: [RabbitService],
})
export class RabbitModule {}
