import { forwardRef, Module } from "@nestjs/common";
import { StudyService } from "./study.service";
import { StudyController } from "./study.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Study } from "./entities/study.entity";
import { PatientModule } from "src/patient/patient.module";
import { PredictionRunModule } from "src/prediction-run/prediction-run.module";
import { InstanceImageModule } from "src/instance-image/instance-image.module";
import { SeriesModule } from "src/series/series.module";

@Module({
  controllers: [StudyController],
  providers: [StudyService],
  imports: [
    SequelizeModule.forFeature([Study]),
    forwardRef(() => PatientModule),
    forwardRef(() => PredictionRunModule),
    forwardRef(() => InstanceImageModule),
    SeriesModule,
  ],
  exports: [StudyService],
})
export class StudyModule {}
