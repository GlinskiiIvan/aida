import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreatePredictionDto } from "./dto/create-prediction.dto";
import { UpdatePredictionDto } from "./dto/update-prediction.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Prediction } from "./entities/prediction.entity";
import { PredictionRunService } from "src/prediction-run/prediction-run.service";
import { PredictionRun } from "src/prediction-run/entities/prediction-run.entity";
import { FindOptions, Includeable, Transaction } from "sequelize";
import { InstanceImageService } from "src/instance-image/instance-image.service";

import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { predictionQueryConfig, PredictionCodes } from "./contracts";

@Injectable()
export class PredictionService {
  constructor(
    @InjectModel(Prediction) private repository: typeof Prediction,
    @Inject(forwardRef(() => PredictionRunService))
    private predictionRunService: PredictionRunService,
    @Inject(forwardRef(() => InstanceImageService))
    private instanceImageService: InstanceImageService,
  ) {}

  private includeRun: Includeable = {
    model: PredictionRun,
    as: "run",
  };

  async create(dto: CreatePredictionDto) {
    try {
      await this.predictionRunService.findOneOrThrow(dto.runId);
      await this.instanceImageService.findOneOrThrow(dto.imageId);

      const prediction = await this.repository.create(dto);

      const response = createResponse<Prediction, PredictionCodes>();
      return response.success(PredictionCodes.CREATE_SUCCESS).data(prediction).build();
    } catch (error) {
      const msg = `Ошибка при создании предсказания. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async bulkCreate(data: Prediction[], transaction: Transaction) {
    try {
      return this.repository.bulkCreate(data, { transaction });
    } catch (error) {
      const msg = `Ошибка при создании всех предсказаний исследования. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

    try {
      let options: FindOptions = {
        order: [["created_at", "DESC"]],
      };

      const { data, resolvedPageination } = await executeQueryResponse(
        this.repository,
        predictionQueryConfig,
        params,
        options,
      );

      const response = createResponse<Prediction[], PredictionCodes>();
      return response
        .success(PredictionCodes.FIND_ALL_SUCCESS)
        .data(data)
        .pagination(
          resolvedPageination.total,
          resolvedPageination.page_size,
          resolvedPageination.page,
        )
        .build();
    } catch (error) {
      const msg = `Ошибка при получении всех предсказаний. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByImageId(imageId: number, params: QueryParams) {
    console.log("params: ", params);

    try {
      let options: FindOptions = {
        where: { imageId },
        order: [["created_at", "DESC"]],
      };

      const { data, resolvedPageination } = await executeQueryResponse(
        this.repository,
        predictionQueryConfig,
        params,
        options,
      );

      const response = createResponse<Prediction[], PredictionCodes>();
      return response
        .success(PredictionCodes.FIND_ALL_BY_IMAGE_ID_SUCCESS)
        .data(data)
        .pagination(
          resolvedPageination.total,
          resolvedPageination.page_size,
          resolvedPageination.page,
        )
        .build();
    } catch (error) {
      const msg = `Ошибка при получении всех предсказаний. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByRunId(runId: number, params: QueryParams) {
    console.log("params: ", params);

    try {
      let options: FindOptions = {
        where: { runId },
        order: [["created_at", "DESC"]],
      };

      const { data, resolvedPageination } = await executeQueryResponse(
        this.repository,
        predictionQueryConfig,
        params,
        options,
      );

      const response = createResponse<Prediction[], PredictionCodes>();
      return response
        .success(PredictionCodes.FIND_ALL_BY_RUN_ID_SUCCESS)
        .data(data)
        .pagination(
          resolvedPageination.total,
          resolvedPageination.page_size,
          resolvedPageination.page,
        )
        .build();
    } catch (error) {
      const msg = `Ошибка при получении всех предсказаний для запуска по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Prediction>, "where">) {
    const prediction = await this.repository.findByPk(id, options);
    if (!prediction) {
      throw new HttpException(`Предсказание не найдено.`, HttpStatus.NOT_FOUND);
    }
    return prediction;
  }

  async findOne(id: number) {
    try {
      const prediction = await this.findOneOrThrow(id, {
        include: [this.includeRun],
      });

      const response = createResponse<Prediction, PredictionCodes>();
      return response.success(PredictionCodes.FIND_ONE_SUCCESS).data(prediction).build();
    } catch (error) {
      const msg = `Ошибка при получении предсказания по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdatePredictionDto) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(dto, {
        where: { id },
        returning: true,
      });

      const response = createResponse<Prediction, PredictionCodes>();
      return response.success(PredictionCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
    } catch (error) {
      const msg = `Ошибка при обновлении предсказания. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({ where: { id } });

      const response = createResponse<Boolean, PredictionCodes>();
      return response.success(PredictionCodes.REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при мягком удалении предсказания. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: { id }, force: true });

      const response = createResponse<Boolean, PredictionCodes>();
      return response.success(PredictionCodes.FORCE_REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при жестком удалении предсказания. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: { id } });

      const response = createResponse<Boolean, PredictionCodes>();
      return response.success(PredictionCodes.RESTORE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при восстановлении предсказания после мягкого удаления. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
