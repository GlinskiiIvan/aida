import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateStudyDto } from "./dto/create-study.dto";
import { UpdateStudyDto } from "./dto/update-study.dto";
import { Patient } from "src/patient/entities/patient.entity";
import { InjectModel } from "@nestjs/sequelize";
import { Study } from "./entities/study.entity";
import { PatientService } from "src/patient/patient.service";
import { FindOptions, Includeable, Transaction } from "sequelize";
import * as path from "path";
import { PredictionRunService } from "src/prediction-run/prediction-run.service";
import { InstanceImageService } from "src/instance-image/instance-image.service";

import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { studyQueryConfig, StudyCodes } from "./contracts";
import { SeriesService } from "src/series/series.service";

@Injectable()
export class StudyService {
  constructor(
    @InjectModel(Study) private repository: typeof Study,
    @Inject(forwardRef(() => PatientService)) private patientServise: PatientService,
    @Inject(forwardRef(() => PredictionRunService))
    private predictionRunService: PredictionRunService,
    @Inject(forwardRef(() => InstanceImageService))
    private instanceImageService: InstanceImageService,
    @Inject(forwardRef(() => SeriesService)) private seriesService: SeriesService,
  ) {}

  private includePatient: Includeable = {
    model: Patient,
    as: "patient",
  };

  async create(dto: CreateStudyDto) {
    try {
      await this.patientServise.findOneOrThrow(dto.patientId);

      const study = await this.repository.create(dto);

      study.path = path.join(
        "/",
        "storage",
        `patients`,
        `${dto.patientId}`,
        `studies`,
        `${study.id}`,
      );
      await study.save();

      const response = createResponse<Study, StudyCodes>();
      return response.success(StudyCodes.CREATE_SUCCESS).data(study).build();
    } catch (error) {
      const msg = `Ошибка при создании исследования. ${error.message}`;
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
        studyQueryConfig,
        params,
        options,
      );

      const response = createResponse<Study[], StudyCodes>();
      return response
        .success(StudyCodes.FIND_ALL_SUCCESS)
        .data(data)
        .pagination(
          resolvedPageination.total,
          resolvedPageination.page_size,
          resolvedPageination.page,
        )
        .build();
    } catch (error) {
      const msg = `Ошибка при получении всех исследований. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByPatientId(patientId: number, params: QueryParams) {
    console.log("params: ", params);

    try {
      let options: FindOptions = {
        where: { patientId },
        order: [["created_at", "DESC"]],
      };

      const { data, resolvedPageination } = await executeQueryResponse(
        this.repository,
        studyQueryConfig,
        params,
        options,
      );

      const response = createResponse<Study[], StudyCodes>();
      return response
        .success(StudyCodes.FIND_ALL_BY_PATIENT_ID_SUCCESS)
        .data(data)
        .pagination(
          resolvedPageination.total,
          resolvedPageination.page_size,
          resolvedPageination.page,
        )
        .build();
    } catch (error) {
      const msg = `Ошибка при получении всех исследований. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllSeries(id: number, params: QueryParams) {
    try {
      const study = await this.findOneOrThrow(id);
      const series = await this.seriesService.findAllByStudyId(id, params);

      return series;
    } catch (error) {
      const msg = `Ошибка при получении всех серий исследования по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllRuns(id: number, params: QueryParams) {
    try {
      const study = await this.findOneOrThrow(id);
      const runs = await this.predictionRunService.findAllByStudyId(id, params);

      return runs;
    } catch (error) {
      const msg = `Ошибка при получении всех запусков предсказаний исследования по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllImages(id: number, params: QueryParams) {
    try {
      const study = await this.findOneOrThrow(id);
      const images = await this.instanceImageService.findAllByStudyId(id, params);

      return images;
    } catch (error) {
      const msg = `Ошибка при получении всех изображений исследования по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Study>, "where">) {
    const study = await this.repository.findByPk(id, options);
    if (!study) {
      throw new HttpException(`Исследование не найдено.`, HttpStatus.NOT_FOUND);
    }
    return study;
  }

  async findOne(id: number) {
    try {
      const study = await this.findOneOrThrow(id, {
        include: [this.includePatient],
      });

      const response = createResponse<Study, StudyCodes>();
      return response.success(StudyCodes.FIND_ONE_SUCCESS).data(study).build();
    } catch (error) {
      const msg = `Ошибка при получении исследования по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdateStudyDto, transaction?: Transaction) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(
        {
          ...dto,
          studyDateTime: dto.studyDateTime ? new Date(dto.studyDateTime) : undefined,
        },
        {
          where: { id },
          returning: true,
          transaction,
        },
      );

      const response = createResponse<Study, StudyCodes>();
      return response.success(StudyCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
    } catch (error) {
      console.error(error);
      const msg = `Ошибка при обновлении исследования. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: { id } });

      const response = createResponse<Boolean, StudyCodes>();
      return response.success(StudyCodes.RESTORE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при восстановлении исследования после мягкого удаления. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({ where: { id } });

      const response = createResponse<Boolean, StudyCodes>();
      return response.success(StudyCodes.REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при мягком удалении исследования. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: { id }, force: true });

      const response = createResponse<Boolean, StudyCodes>();
      return response.success(StudyCodes.FORCE_REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при жестком удалении исследования. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
