import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { InstanceImageService } from "./instance-image.service";
import { CreateInstanceImageDto } from "./dto/create-instance-image.dto";
import { UpdateInstanceImageDto } from "./dto/update-instance-image.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from "@nestjs/swagger";
import { Permissions } from "src/decorators/permissions.decorator";
import { InstanceImage } from "./entities/instance-image.entity";
import { Prediction } from "src/prediction/entities/prediction.entity";
import { OperationCode } from "src/decorators/operation-code.decorator";
import { InstanceImageCodes } from "./contracts";

import { QueryParams, QueryParamsPipe } from "../common/query";

@ApiBearerAuth("token")
@ApiTags("Инстанс изображения")
@Controller("instance-image")
export class InstanceImageController {
  constructor(private readonly instanceImageService: InstanceImageService) {}

  @ApiOperation({ summary: "Создание инстанса изображения" })
  @ApiResponse({ status: 200, type: InstanceImage })
  @Permissions("instance-image:create")
  @OperationCode(InstanceImageCodes.CREATE_ERROR)
  @Post()
  create(@Body() createInstanceImageDto: CreateInstanceImageDto) {
    return this.instanceImageService.create(createInstanceImageDto);
  }

  @ApiOperation({ summary: "Получение всех инстансов изображений" })
  @ApiResponse({ status: 200, type: [InstanceImage] })
  @ApiQuery({
    name: "q",
    required: false,
    type: String,
    description:
      "QueryParams в формате Base64 URL-safe JSON. Содержит поиск, фильтрацию, сортировку и пагинацию.",
    example:
      "eyJzZWFyY2giOnsiYnkiOiJpbWFnZU5hbWUiLCJ2YWx1ZSI6IlUwMDAwMDAyLnBuZyIsIm1vZGUiOiJleGFjdCJ9fQ",
  })
  @Permissions("instance-image:read")
  @OperationCode(InstanceImageCodes.FIND_ALL_ERROR)
  @Get()
  findAll(@Query("q", QueryParamsPipe) params: QueryParams) {
    return this.instanceImageService.findAll(params);
  }

  @ApiOperation({ summary: "Получение инстанса изображения по id" })
  @ApiResponse({ status: 200, type: InstanceImage })
  @Permissions("instance-image:read")
  @OperationCode(InstanceImageCodes.FIND_ONE_ERROR)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.instanceImageService.findOne(+id);
  }

  @ApiOperation({ summary: "Получение всех предсказаний инстанса изображения" })
  @ApiResponse({ status: 200, type: [Prediction] })
  @Permissions("instance-image:read")
  @OperationCode(InstanceImageCodes.FIND_ALL_PREDICTIONS_ERROR)
  @Get(":id")
  findAllPredictions(@Param("id") id: string, @Query("q", QueryParamsPipe) params: QueryParams) {
    return this.instanceImageService.findAllPredictions(+id, params);
  }

  @ApiOperation({ summary: "Обновление инстанса изображения" })
  @ApiResponse({ status: 200, type: InstanceImage })
  @Permissions("instance-image:update")
  @OperationCode(InstanceImageCodes.UPDATE_ERROR)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateInstanceImageDto: UpdateInstanceImageDto) {
    return this.instanceImageService.update(+id, updateInstanceImageDto);
  }

  @ApiOperation({ summary: "Восстановление инстанса изображения после мягкого удаления" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("instance-image:delete")
  @OperationCode(InstanceImageCodes.RESTORE_ERROR)
  @Patch(":id/restore")
  restore(@Param("id") id: string) {
    return this.instanceImageService.restore(+id);
  }

  @ApiOperation({ summary: "Мягкое удаление инстанса изображения" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("instance-image:delete")
  @OperationCode(InstanceImageCodes.REMOVE_ERROR)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.instanceImageService.remove(+id);
  }

  @ApiOperation({ summary: "Жесткое удаление инстанса изображения" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("instance-image:delete")
  @OperationCode(InstanceImageCodes.FORCE_REMOVE_ERROR)
  @Delete(":id/force")
  forceRemove(@Param("id") id: string) {
    return this.instanceImageService.forceRemove(+id);
  }
}
