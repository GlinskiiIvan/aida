import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { SeriesService } from "./series.service";
import { CreateSeriesDto } from "./dto/create-series.dto";
import { UpdateSeriesDto } from "./dto/update-series.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Series } from "./entities/series.entity";
import { Permissions } from "src/decorators/permissions.decorator";
import { InstanceImage } from "src/instance-image/entities/instance-image.entity";
import { QueryParams, QueryParamsPipe } from "../common/query";
import { OperationCode } from "src/decorators/operation-code.decorator";
import { SeriesCodes } from "./contracts";

@ApiBearerAuth("token")
@ApiTags("Серия")
@Controller("series")
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @ApiOperation({ summary: "Создание серии" })
  @ApiResponse({ status: 200, type: Series })
  @Permissions("series:create")
  @OperationCode(SeriesCodes.CREATE_ERROR)
  @Post()
  create(@Body() dto: CreateSeriesDto) {
    return this.seriesService.create(dto);
  }

  @ApiOperation({ summary: "Получение всех серий" })
  @ApiResponse({ status: 200, type: [Series] })
  @Permissions("series:read")
  @OperationCode(SeriesCodes.FIND_ALL_ERROR)
  @Get()
  findAll(@Query("q", QueryParamsPipe) params: QueryParams) {
    return this.seriesService.findAll(params);
  }

  @ApiOperation({ summary: "Получение серии по id" })
  @ApiResponse({ status: 200, type: Series })
  @Permissions("series:read")
  @OperationCode(SeriesCodes.FIND_ONE_ERROR)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.seriesService.findOne(id);
  }

  @ApiOperation({ summary: "Получение всех изображений серии по id" })
  @ApiResponse({ status: 200, type: [InstanceImage] })
  @Permissions("series:read")
  @OperationCode(SeriesCodes.FIND_ALL_IMAGES_ERROR)
  @Get(":id/images")
  findAllImages(@Param("id") id: string, @Query("q", QueryParamsPipe) params: QueryParams) {
    return this.seriesService.findAllImages(id, params);
  }

  @ApiOperation({ summary: "Обновление серии" })
  @ApiResponse({ status: 200, type: Series })
  @Permissions("series:update")
  @OperationCode(SeriesCodes.UPDATE_ERROR)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateSeriesDto) {
    return this.seriesService.update(id, dto);
  }

  @ApiOperation({ summary: "Восстановление серии после мягкого удаления" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("series:delete")
  @OperationCode(SeriesCodes.RESTORE_ERROR)
  @Patch(":id/restore")
  restore(@Param("id") id: string) {
    return this.seriesService.restore(id);
  }

  @ApiOperation({ summary: "Мягкое удаление серии" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("series:delete")
  @OperationCode(SeriesCodes.REMOVE_ERROR)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.seriesService.remove(id);
  }

  @ApiOperation({ summary: "Жесткое удаление серии" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("series:delete")
  @OperationCode(SeriesCodes.FORCE_REMOVE_ERROR)
  @Delete(":id/force")
  forceRemove(@Param("id") id: string) {
    return this.seriesService.forceRemove(id);
  }
}
