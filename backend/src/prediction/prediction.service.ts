import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreatePredictionDto } from "./dto/create-prediction.dto";
import { UpdatePredictionDto } from "./dto/update-prediction.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Prediction } from "./entities/prediction.entity";
import { PredictionRunService } from "src/prediction-run/prediction-run.service";
import { PredictionRun } from "src/prediction-run/entities/prediction-run.entity";
import { FindOptions, Includeable, Transaction } from "sequelize";
import { InstanceImageService } from "src/instance-image/instance-image.service";

import { AppException } from "src/exceptions/app.exception";
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
    await this.predictionRunService.findOneOrThrow(dto.runId);
    await this.instanceImageService.findOneOrThrow(dto.imageId);

    const prediction = await this.repository.create(dto);

    const response = createResponse<Prediction, PredictionCodes>();
    return response.success(PredictionCodes.CREATE_SUCCESS).data(prediction).build();
  }

  async bulkCreate(data: Prediction[], transaction: Transaction) {
    return this.repository.bulkCreate(data, { transaction });
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      order: [["createdAt", "DESC"]],
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
  }

  async findAllByImageId(imageId: number, params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      where: { imageId },
      order: [["createdAt", "DESC"]],
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
  }

  async findAllByRunId(runId: number, params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      where: { runId },
      order: [["createdAt", "DESC"]],
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
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Prediction>, "where">) {
    const prediction = await this.repository.findByPk(id, options);
    if (!prediction) {
      throw new AppException({
        status: HttpStatus.NOT_FOUND,
        code: PredictionCodes.FIND_ONE_OR_THROW_ERROR,
      });
    }
    return prediction;
  }

  async findOne(id: number) {
    const prediction = await this.findOneOrThrow(id, {
      include: [this.includeRun],
    });

    const response = createResponse<Prediction, PredictionCodes>();
    return response.success(PredictionCodes.FIND_ONE_SUCCESS).data(prediction).build();
  }

  async update(id: number, dto: UpdatePredictionDto) {
    await this.findOneOrThrow(id);
    const [_, updatedRows] = await this.repository.update(dto, {
      where: { id },
      returning: true,
    });

    const response = createResponse<Prediction, PredictionCodes>();
    return response.success(PredictionCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
  }

  async remove(id: number) {
    await this.findOneOrThrow(id);
    await this.repository.destroy({ where: { id } });

    const response = createResponse<Boolean, PredictionCodes>();
    return response.success(PredictionCodes.REMOVE_SUCCESS).data(true).build();
  }

  async forceRemove(id: number) {
    await this.repository.destroy({ where: { id }, force: true });

    const response = createResponse<Boolean, PredictionCodes>();
    return response.success(PredictionCodes.FORCE_REMOVE_SUCCESS).data(true).build();
  }

  async restore(id: number) {
    await this.repository.restore({ where: { id } });

    const response = createResponse<Boolean, PredictionCodes>();
    return response.success(PredictionCodes.RESTORE_SUCCESS).data(true).build();
  }
}
