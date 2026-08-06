import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreatePredictionRunDto } from "./dto/create-prediction-run.dto";
import { UpdatePredictionRunDto } from "./dto/update-prediction-run.dto";
import { InjectModel } from "@nestjs/sequelize";
import { PredictionRun } from "./entities/prediction-run.entity";
import { FindOptions, Transaction } from "sequelize";
import { StudyService } from "src/study/study.service";
import { PredictionService } from "src/prediction/prediction.service";

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
    try {
      await this.studyService.findOneOrThrow(dto.studyId);
      // await this.doctorServise.findOneOrThrow(dto.createdById);

      const run = await this.repository.create(dto);

      const response = createResponse<PredictionRun, PredictionRunCodes>();
      return response.success(PredictionRunCodes.CREATE_SUCCESS).data(run).build();
    } catch (error) {
      const msg = `Ошибка при создании запуска предсказания. ${error.message}`;
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
    } catch (error) {
      const msg = `Ошибка при получении всех запусков предсказания. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByStudyId(studyId: number, params: QueryParams) {
    console.log("params: ", params);

    try {
      let options: FindOptions = {
        where: { studyId },
        order: [["created_at", "DESC"]],
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
    } catch (error) {
      const msg = `Ошибка при получении всех запусков предсказания. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByUserId(userId: number, params: QueryParams) {
    console.log("params: ", params);

    try {
      let options: FindOptions = {
        where: { createdById: userId },
        order: [["created_at", "DESC"]],
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
    } catch (error) {
      const msg = `Ошибка при получении всех запусков предсказания. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
  async findAllPredictions(id: number, params: QueryParams) {
    try {
      const run = await this.findOneOrThrow(id);
      const predictions = await this.predictionService.findAllByRunId(id, params);

      return predictions;
    } catch (error) {
      const msg = `Ошибка при получении всех предсказаний запуска предсказания по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<PredictionRun>, "where">) {
    const run = await this.repository.findByPk(id, options);
    if (!run) {
      throw new HttpException(`Запуск предсказания не найден.`, HttpStatus.NOT_FOUND);
    }
    return run;
  }

  async findOne(id: number) {
    try {
      const run = await this.findOneOrThrow(id);

      const response = createResponse<PredictionRun, PredictionRunCodes>();
      return response.success(PredictionRunCodes.FIND_ONE_SUCCESS).data(run).build();
    } catch (error) {
      const msg = `Ошибка при получении запуска предсказания по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdatePredictionRunDto, transaction?: Transaction) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(dto, {
        where: { id },
        returning: true,
        transaction,
      });

      const response = createResponse<PredictionRun, PredictionRunCodes>();
      return response.success(PredictionRunCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
    } catch (error) {
      const msg = `Ошибка при обновлении запуска предсказания. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: { id } });

      const response = createResponse<Boolean, PredictionRunCodes>();
      return response.success(PredictionRunCodes.RESTORE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при восстановлении запуска предсказания после мягкого удаления. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({ where: { id } });

      const response = createResponse<Boolean, PredictionRunCodes>();
      return response.success(PredictionRunCodes.REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при мягком удалении запуска предсказания. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: { id }, force: true });

      const response = createResponse<Boolean, PredictionRunCodes>();
      return response.success(PredictionRunCodes.FORCE_REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при жестком удалении запуска предсказания. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
