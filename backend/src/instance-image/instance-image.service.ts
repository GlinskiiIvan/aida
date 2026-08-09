import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateInstanceImageDto } from "./dto/create-instance-image.dto";
import { UpdateInstanceImageDto } from "./dto/update-instance-image.dto";
import { InjectModel } from "@nestjs/sequelize";
import { InstanceImage } from "./entities/instance-image.entity";
import { SeriesService } from "src/series/series.service";
import { FindOptions, Transaction } from "sequelize";
import * as path from "path";
import { Series } from "src/series/entities/series.entity";

import { AppException } from "src/exceptions/app.exception";
import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";

import { imageQueryConfig, InstanceImageCodes } from "./contracts";
import { PredictionService } from "src/prediction/prediction.service";

@Injectable()
export class InstanceImageService {
  constructor(
    @InjectModel(InstanceImage) private repository: typeof InstanceImage,
    @Inject(forwardRef(() => SeriesService)) private seriesService: SeriesService,
    private predictionService: PredictionService,
  ) {}

  async create(dto: CreateInstanceImageDto) {
    const series = await this.seriesService.findOneOrThrow(dto.seriesId);

    const instance = await this.repository.create(dto);
    instance.imagePath = path.join(series.path, dto.imageName);
    await instance.save();

    const response = createResponse<InstanceImage, InstanceImageCodes>();
    return response.success(InstanceImageCodes.CREATE_SUCCESS).data(instance).build();
  }

  async bulkCreate(data: InstanceImage[], transaction: Transaction) {
    return this.repository.bulkCreate(data, { transaction });
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      order: [["instanceNumber", "ASC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      imageQueryConfig,
      params,
      options,
    );

    const response = createResponse<InstanceImage[], InstanceImageCodes>();
    return response
      .success(InstanceImageCodes.FIND_ALL_SUCCESS)
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
      include: [
        {
          model: Series,
          as: "series",
          where: { studyId },
          required: true,
        },
      ],
      order: [
        [{ model: Series, as: "series" }, "id", "ASC"],
        ["instanceNumber", "ASC"],
      ],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      imageQueryConfig,
      params,
      options,
    );

    const response = createResponse<InstanceImage[], InstanceImageCodes>();
    return response
      .success(InstanceImageCodes.FIND_ALL_BY_STUDY_ID_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }

  async findAllBySeriesId(seriesId: string, params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      where: { seriesId },
      order: [
        [{ model: Series, as: "series" }, "id", "ASC"],
        ["instanceNumber", "ASC"],
      ],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      imageQueryConfig,
      params,
      options,
    );

    const response = createResponse<InstanceImage[], InstanceImageCodes>();
    return response
      .success(InstanceImageCodes.FIND_ALL_BY_SERIES_ID_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }

  async findAllPredictions(id: number, params: QueryParams) {
    const instance = await this.findOneOrThrow(id);
    const predictions = await this.predictionService.findAllByImageId(id, params);

    return predictions;
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<InstanceImage>, "where">) {
    const instance = await this.repository.findByPk(id, options);
    if (!instance) {
      throw new AppException({
        status: HttpStatus.NOT_FOUND,
        code: InstanceImageCodes.FIND_ONE_OR_THROW_ERROR,
      });
    }
    return instance;
  }

  async findOne(id: number) {
    const instance = await this.findOneOrThrow(id);

    const response = createResponse<InstanceImage, InstanceImageCodes>();
    return response.success(InstanceImageCodes.FIND_ONE_SUCCESS).data(instance).build();
  }

  async update(id: number, dto: UpdateInstanceImageDto) {
    await this.findOneOrThrow(id);
    const [_, updatedRows] = await this.repository.update(dto, {
      where: { id },
      returning: true,
    });

    const response = createResponse<InstanceImage, InstanceImageCodes>();
    return response.success(InstanceImageCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
  }

  async remove(id: number) {
    await this.findOneOrThrow(id);
    await this.repository.destroy({ where: { id } });

    const response = createResponse<Boolean, InstanceImageCodes>();
    return response.success(InstanceImageCodes.REMOVE_SUCCESS).data(true).build();
  }

  async forceRemove(id: number) {
    await this.repository.destroy({ where: { id }, force: true });

    const response = createResponse<Boolean, InstanceImageCodes>();
    return response.success(InstanceImageCodes.FORCE_REMOVE_SUCCESS).data(true).build();
  }

  async restore(id: number) {
    await this.repository.restore({ where: { id } });

    const response = createResponse<Boolean, InstanceImageCodes>();
    return response.success(InstanceImageCodes.RESTORE_SUCCESS).data(true).build();
  }
}
