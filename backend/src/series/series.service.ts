import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateSeriesDto } from "./dto/create-series.dto";
import { UpdateSeriesDto } from "./dto/update-series.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Series } from "./entities/series.entity";
import { StudyService } from "src/study/study.service";
import { FindOptions, Transaction } from "sequelize";
import * as path from "path";

import { AppException } from "src/exceptions/app.exception";
import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { seriesQueryConfig, SeriesCodes } from "./contracts";
import { InstanceImageService } from "src/instance-image/instance-image.service";

@Injectable()
export class SeriesService {
  constructor(
    @InjectModel(Series) private repository: typeof Series,
    @Inject(forwardRef(() => StudyService)) private studyServise: StudyService,
    @Inject(forwardRef(() => InstanceImageService)) private imageService: InstanceImageService,
  ) {}

  async create(dto: CreateSeriesDto) {
    const study = await this.studyServise.findOneOrThrow(dto.studyId);

    const series = await this.repository.create(dto);

    series.path = path.join(study.path, "processed", `series_${series.id}`);
    await series.save();

    const response = createResponse<Series, SeriesCodes>();
    return response.success(SeriesCodes.CREATE_SUCCESS).data(series).build();
  }

  async bulkCreate(data: Series[], transaction: Transaction) {
    return this.repository.bulkCreate(data, { transaction });
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      order: [["created_at", "DESC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      seriesQueryConfig,
      params,
      options,
    );

    const response = createResponse<Series[], SeriesCodes>();
    return response
      .success(SeriesCodes.FIND_ALL_SUCCESS)
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
      order: [["created_at", "DESC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      seriesQueryConfig,
      params,
      options,
    );

    const response = createResponse<Series[], SeriesCodes>();
    return response
      .success(SeriesCodes.FIND_ALL_BY_STUDY_ID_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }

  async findAllImages(id: string, params: QueryParams) {
    const series = await this.findOneOrThrow(id);
    const images = await this.imageService.findAllBySeriesId(id, params);

    return images;
  }

  async findOneOrThrow(id: string, options?: Omit<FindOptions<Series>, "where">) {
    const series = await this.repository.findByPk(id, options);

    if (!series) {
      throw new AppException({
        status: HttpStatus.NOT_FOUND,
        code: SeriesCodes.FIND_ONE_OR_THROW_ERROR,
      });
    }

    return series;
  }

  async findOne(id: string) {
    const series = await this.findOneOrThrow(id);

    const response = createResponse<Series, SeriesCodes>();
    return response.success(SeriesCodes.FIND_ONE_SUCCESS).data(series).build();
  }

  async update(id: string, dto: UpdateSeriesDto) {
    await this.findOneOrThrow(id);
    const [_, updatedRows] = await this.repository.update(dto, {
      where: { id },
      returning: true,
    });

    const response = createResponse<Series, SeriesCodes>();
    return response.success(SeriesCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
  }

  async restore(id: string) {
    await this.repository.restore({ where: { id } });

    const response = createResponse<Boolean, SeriesCodes>();
    return response.success(SeriesCodes.RESTORE_SUCCESS).data(true).build();
  }

  async remove(id: string) {
    await this.findOneOrThrow(id);
    await this.repository.destroy({ where: { id } });

    const response = createResponse<Boolean, SeriesCodes>();
    return response.success(SeriesCodes.REMOVE_SUCCESS).data(true).build();
  }

  async forceRemove(id: string) {
    await this.repository.destroy({ where: { id }, force: true });

    const response = createResponse<Boolean, SeriesCodes>();
    return response.success(SeriesCodes.FORCE_REMOVE_SUCCESS).data(true).build();
  }
}
