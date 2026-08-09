import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreatePredictionRunDto } from "./dto/create-prediction-run.dto";
import { UpdatePredictionRunDto } from "./dto/update-prediction-run.dto";
import { InjectModel } from "@nestjs/sequelize";
import { PredictionRun } from "./entities/prediction-run.entity";
import { FindOptions, Transaction } from "sequelize";
import { StudyService } from "src/study/study.service";
import { PredictionService } from "src/prediction/prediction.service";

import { AppException } from "src/exceptions/app.exception";
import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { predictionRunQueryConfig, PredictionRunCodes } from "./contracts";

@Injectable()
export class PredictionRunService {
  constructor(
    @InjectModel(PredictionRun) private repository: typeof PredictionRun,
    @Inject(forwardRef(() => StudyService)) private studyService: StudyService,
    @Inject(forwardRef(() => PredictionService)) private predictionService: PredictionService,
  ) {}

  async create(dto: CreatePredictionRunDto) {
    await this.studyService.findOneOrThrow(dto.studyId);
    // await this.doctorServise.findOneOrThrow(dto.createdById);

    const run = await this.repository.create(dto);

    const response = createResponse<PredictionRun, PredictionRunCodes>();
    return response.success(PredictionRunCodes.CREATE_SUCCESS).data(run).build();
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      order: [["createdAt", "DESC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      predictionRunQueryConfig,
      params,
      options,
    );

    const response = createResponse<PredictionRun[], PredictionRunCodes>();
    return response
      .success(PredictionRunCodes.FIND_ALL_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }

  async findAllByStudyId(studyId: number, params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      where: { studyId },
      order: [["createdAt", "DESC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      predictionRunQueryConfig,
      params,
      options,
    );

    const response = createResponse<PredictionRun[], PredictionRunCodes>();
    return response
      .success(PredictionRunCodes.FIND_ALL_BY_STUDY_ID_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }

  async findAllByUserId(userId: number, params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      where: { createdById: userId },
      order: [["createdAt", "DESC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      predictionRunQueryConfig,
      params,
      options,
    );

    const response = createResponse<PredictionRun[], PredictionRunCodes>();
    return response
      .success(PredictionRunCodes.FIND_ALL_BY_USER_ID_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }
  async findAllPredictions(id: number, params: QueryParams) {
    const run = await this.findOneOrThrow(id);
    const predictions = await this.predictionService.findAllByRunId(id, params);

    return predictions;
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<PredictionRun>, "where">) {
    const run = await this.repository.findByPk(id, options);
    if (!run) {
      throw new AppException({
        status: HttpStatus.NOT_FOUND,
        code: PredictionRunCodes.FIND_ONE_OR_THROW_ERROR,
      });
    }
    return run;
  }

  async findOne(id: number) {
    const run = await this.findOneOrThrow(id);

    const response = createResponse<PredictionRun, PredictionRunCodes>();
    return response.success(PredictionRunCodes.FIND_ONE_SUCCESS).data(run).build();
  }

  async update(id: number, dto: UpdatePredictionRunDto, transaction?: Transaction) {
    await this.findOneOrThrow(id);
    const [_, updatedRows] = await this.repository.update(dto, {
      where: { id },
      returning: true,
      transaction,
    });

    const response = createResponse<PredictionRun, PredictionRunCodes>();
    return response.success(PredictionRunCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
  }

  async restore(id: number) {
    await this.repository.restore({ where: { id } });

    const response = createResponse<Boolean, PredictionRunCodes>();
    return response.success(PredictionRunCodes.RESTORE_SUCCESS).data(true).build();
  }

  async remove(id: number) {
    await this.findOneOrThrow(id);
    await this.repository.destroy({ where: { id } });

    const response = createResponse<Boolean, PredictionRunCodes>();
    return response.success(PredictionRunCodes.REMOVE_SUCCESS).data(true).build();
  }

  async forceRemove(id: number) {
    await this.repository.destroy({ where: { id }, force: true });

    const response = createResponse<Boolean, PredictionRunCodes>();
    return response.success(PredictionRunCodes.FORCE_REMOVE_SUCCESS).data(true).build();
  }
}
