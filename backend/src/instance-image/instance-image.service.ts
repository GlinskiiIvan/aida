import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateInstanceImageDto } from "./dto/create-instance-image.dto";
import { UpdateInstanceImageDto } from "./dto/update-instance-image.dto";
import { InjectModel } from "@nestjs/sequelize";
import { InstanceImage } from "./entities/instance-image.entity";
import { SeriesService } from "src/series/series.service";
import { FindOptions, Transaction } from "sequelize";
import * as path from "path";
import { Series } from "src/series/entities/series.entity";

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
    try {
      const series = await this.seriesService.findOneOrThrow(dto.seriesId);

      const instance = await this.repository.create(dto);
      instance.imagePath = path.join(series.path, dto.imageName);
      await instance.save();

      const response = createResponse<InstanceImage, InstanceImageCodes>();
      return response.success(InstanceImageCodes.CREATE_SUCCESS).data(instance).build();
    } catch (error) {
      const msg = `Ошибка при создании инстанса изображения. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async bulkCreate(data: InstanceImage[], transaction: Transaction) {
    try {
      return this.repository.bulkCreate(data, { transaction });
    } catch (error) {
      const msg = `Ошибка при создании всех инстансов изображений исследования. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

    try {
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
    } catch (error) {
      const msg = `Ошибка при получении всех инстансов изображений. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
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
    try {
      const instance = await this.findOneOrThrow(id);
      const predictions = await this.predictionService.findAllByImageId(id, params);

      return predictions;
    } catch (error) {
      const msg = `Ошибка при получении всех предсказаний инстанса изображения по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<InstanceImage>, "where">) {
    const instance = await this.repository.findByPk(id, options);
    if (!instance) {
      throw new HttpException(`Инстанс изображения не найден.`, HttpStatus.NOT_FOUND);
    }
    return instance;
  }

  async findOne(id: number) {
    try {
      const instance = await this.findOneOrThrow(id);

      const response = createResponse<InstanceImage, InstanceImageCodes>();
      return response.success(InstanceImageCodes.FIND_ONE_SUCCESS).data(instance).build();
    } catch (error) {
      const msg = `Ошибка при получении инстанса изображения по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdateInstanceImageDto) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(dto, {
        where: { id },
        returning: true,
      });

      const response = createResponse<InstanceImage, InstanceImageCodes>();
      return response.success(InstanceImageCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
    } catch (error) {
      const msg = `Ошибка при обновлении инстанса изображения. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({ where: { id } });

      const response = createResponse<Boolean, InstanceImageCodes>();
      return response.success(InstanceImageCodes.REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при мягком удалении инстанса изображения. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: { id }, force: true });

      const response = createResponse<Boolean, InstanceImageCodes>();
      return response.success(InstanceImageCodes.FORCE_REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при жестком удалении инстанса изображения. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: { id } });

      const response = createResponse<Boolean, InstanceImageCodes>();
      return response.success(InstanceImageCodes.RESTORE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при восстановлении инстанса изображения после мягкого удаления. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
