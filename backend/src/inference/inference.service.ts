import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PredictionRunDto } from "./dto/prediction-run.dto";
import { StudyService } from "src/study/study.service";
import { PredictionRunService } from "src/prediction-run/prediction-run.service";
import { Status } from "src/common/enums";
import { PredictionService } from "src/prediction/prediction.service";
import { PredictionRun } from "src/prediction-run/entities/prediction-run.entity";
import { RabbitPublisher } from "src/rabbit/rabbit.publisher";
import { RabbitRoutingKey } from "src/rabbit/rabbit.constants";
import { Sequelize } from "sequelize-typescript";
import { RabbitRpcService } from "src/rabbit/rabbit-rpc.service";

import { v7 as uuidv7 } from "uuid";

@Injectable()
export class InferenceService {
  constructor(
    private studyService: StudyService,
    private predictionRunService: PredictionRunService,
    private predictionService: PredictionService,
    private rabbitPublisher: RabbitPublisher,
    private rabbitRpc: RabbitRpcService,
    private readonly sequelize: Sequelize,
  ) {}

  async predict(studyId: number, createdById: number, dto: PredictionRunDto) {
    let run: PredictionRun | null = null;

    try {
      const images = await this.studyService.findAllImages(studyId, undefined);

      const requestId = uuidv7();

      run = await this.predictionRunService.create({
        studyId: studyId,
        createdById: createdById,
        model: dto.model,
        version: dto.version,
      });

      await this.rabbitPublisher.publish(RabbitRoutingKey.INFERENCE_REQUEST, {
        requestId,
        runId: run.id,
        type: "det",
        model_name: "yolo_8x",
        images: images.data.map((image) => ({ id: image.id, path: image.imagePath })),
      });

      const response = await this.rabbitRpc.wait(requestId);
      if (response) {
        return {
          taskId: response.taskId,
          status: "pending",
        };
      }

      return {
        taskId: null,
        status: "queued",
        message:
          "Задача поставлена в очередь. Выполнение начнется после появления доступного обработчика.",
      };
    } catch (error) {
      if (run) {
        await this.predictionRunService.update(run.id, { status: Status.Failed });
      }
      const msg = `Ошибка при выполнении предсказания исследовния. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async completeInferenceProcessing(data) {
    const transaction = await this.sequelize.transaction();

    try {
      await this.predictionRunService.update(data.runId, { status: Status.Completed }, transaction);

      await this.predictionService.bulkCreate(data.predictions, transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
}
