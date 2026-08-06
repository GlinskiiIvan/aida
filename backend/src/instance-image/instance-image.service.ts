import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateInstanceImageDto } from "./dto/create-instance-image.dto";
import { UpdateInstanceImageDto } from "./dto/update-instance-image.dto";
import { InjectModel } from "@nestjs/sequelize";
import { InstanceImage } from "./entities/instance-image.entity";
import { SeriesService } from "src/series/series.service";
import { FindOptions, Includeable, Transaction, CountOptions } from "sequelize";
import { Prediction } from "src/prediction/entities/prediction.entity";
import * as path from "path";
import { buildResultData, FindAllServiceParams } from "src/utils";
import { Series } from "src/series/entities/series.entity";

import { QueryParams } from "../common/query/schemas";
import { executeQueryResponse } from "../common/query/executor";

import { createResponse } from "../common/response";

import { imageQueryConfig } from "./contracts";

@Injectable()
export class InstanceImageService {
  constructor(
    @InjectModel(InstanceImage) private repository: typeof InstanceImage,
    @Inject(forwardRef(() => SeriesService)) private seriesService: SeriesService,
  ) {}

  private attributesModel = [];

  private includePredictions: Includeable = {
    model: Prediction,
    as: "predictions",
  };

  async create(dto: CreateInstanceImageDto) {
    try {
      const series = await this.seriesService.findOneOrThrow(dto.seriesId);

      const instance = await this.repository.create(dto);
      instance.imagePath = path.join(series.path, dto.imageName);
      await instance.save();

      return instance;
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

      const response = createResponse<InstanceImage[]>();
      return response
        .success("instance_image.getAll.success")
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

  async findAllByStudyId(studyId: number, params: FindAllServiceParams) {
    const { rows, count } = await this.repository.findAndCountAll({
      limit: params?.pageSize || undefined,
      offset: params?.offset || undefined,

      include: [
        {
          model: Series,
          as: "series",
          required: true,
          where: { studyId },
        },
      ],

      order: [
        [{ model: Series, as: "series" }, "id", "ASC"],
        ["instanceNumber", "ASC"],
      ],
    });

    return buildResultData({
      rows,
      count,
      page: params?.page || undefined,
      limit: params?.pageSize || undefined,
    });
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
      return instance;
    } catch (error) {
      const msg = `Ошибка при получении инстанса изображения по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllPredictions(id: number) {
    try {
      const instance = await this.findOneOrThrow(id, {
        include: [this.includePredictions],
      });
      return instance.predictions;
    } catch (error) {
      const msg = `Ошибка при получении всех предсказаний инстанса изображения по id. ${error.message}`;
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
      return updatedRows[0];
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
      return true;
    } catch (error) {
      const msg = `Ошибка при мягком удалении инстанса изображения. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: { id }, force: true });
      return true;
    } catch (error) {
      const msg = `Ошибка при жестком удалении инстанса изображения. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: { id } });
      return true;
    } catch (error) {
      const msg = `Ошибка при восстановлении инстанса изображения после мягкого удаления. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
