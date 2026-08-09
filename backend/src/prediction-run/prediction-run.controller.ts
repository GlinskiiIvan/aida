import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { PredictionRunService } from "./prediction-run.service";
import { CreatePredictionRunDto } from "./dto/create-prediction-run.dto";
import { UpdatePredictionRunDto } from "./dto/update-prediction-run.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Permissions } from "src/decorators/permissions.decorator";
import { PredictionRun } from "./entities/prediction-run.entity";
import { Prediction } from "src/prediction/entities/prediction.entity";
import { QueryParams, QueryParamsPipe } from "../common/query";
import { OperationCode } from "src/decorators/operation-code.decorator";
import { PredictionRunCodes } from "./contracts";

@ApiBearerAuth("token")
@ApiTags("Запуск предсказания")
@Controller("prediction-run")
export class PredictionRunController {
  constructor(private readonly predictionRunService: PredictionRunService) {}

  @ApiOperation({ summary: "Создание запуска предсказания" })
  @ApiResponse({ status: 200, type: PredictionRun })
  @Permissions("prediction-run:create")
  @OperationCode(PredictionRunCodes.CREATE_ERROR)
  @Post()
  create(@Body() dto: CreatePredictionRunDto) {
    return this.predictionRunService.create(dto);
  }

  @ApiOperation({ summary: "Получение всех запусков предсказаний" })
  @ApiResponse({ status: 200, type: [PredictionRun] })
  @Permissions("prediction-run:read")
  @OperationCode(PredictionRunCodes.FIND_ALL_ERROR)
  @Get()
  findAll(@Query("q", QueryParamsPipe) params: QueryParams) {
    return this.predictionRunService.findAll(params);
  }

  @ApiOperation({ summary: "Получение запуска предсказания по id" })
  @ApiResponse({ status: 200, type: PredictionRun })
  @Permissions("prediction-run:read")
  @OperationCode(PredictionRunCodes.FIND_ONE_ERROR)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.predictionRunService.findOne(+id);
  }

  @ApiOperation({ summary: "Получение всех предсказаний запуска предсказания по id" })
  @ApiResponse({ status: 200, type: [Prediction] })
  @Permissions("prediction-run:read")
  @OperationCode(PredictionRunCodes.FIND_ALL_PREDICTIONS_ERROR)
  @Get(":id/predictions")
  findAllPredictions(@Param("id") id: string, @Query("q", QueryParamsPipe) params: QueryParams) {
    return this.predictionRunService.findAllPredictions(+id, params);
  }

  @ApiOperation({ summary: "Обновление запуска предсказания" })
  @ApiResponse({ status: 200, type: PredictionRun })
  @Permissions("prediction-run:update")
  @OperationCode(PredictionRunCodes.UPDATE_ERROR)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePredictionRunDto) {
    return this.predictionRunService.update(+id, dto);
  }

  @ApiOperation({ summary: "Восстановление запуска предсказания после мягкого удаления" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("prediction-run:delete")
  @OperationCode(PredictionRunCodes.RESTORE_ERROR)
  @Patch(":id/restore")
  restore(@Param("id") id: string) {
    return this.predictionRunService.restore(+id);
  }

  @ApiOperation({ summary: "Мягкое удаление запуска предсказания" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("prediction-run:delete")
  @OperationCode(PredictionRunCodes.REMOVE_ERROR)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.predictionRunService.remove(+id);
  }

  @ApiOperation({ summary: "Жесткое удаление запуска предсказания" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("prediction-run:delete")
  @OperationCode(PredictionRunCodes.FORCE_REMOVE_ERROR)
  @Delete(":id/force")
  forceRemove(@Param("id") id: string) {
    return this.predictionRunService.forceRemove(+id);
  }
}
