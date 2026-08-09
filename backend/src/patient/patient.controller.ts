import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from "@nestjs/common";
import { PatientService } from "./patient.service";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Patient } from "./entities/patient.entity";
import { Permissions } from "src/decorators/permissions.decorator";
import { Study } from "src/study/entities/study.entity";
import { OperationCode } from "src/decorators/operation-code.decorator";
import { PatientCodes } from "./contracts";

import { QueryParams, QueryParamsPipe } from "../common/query";

@ApiBearerAuth("token")
@ApiTags("Пациент")
@Controller("patients")
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({ summary: "Создание пациента" })
  @ApiResponse({ status: 200, type: Patient })
  @Permissions("patient:create")
  @OperationCode(PatientCodes.CREATE_ERROR)
  @Post()
  create(@Body() dto: CreatePatientDto, @Request() req) {
    return this.patientService.create(dto, req.user.id);
  }

  @ApiOperation({ summary: "Получение всех пациентов" })
  @ApiResponse({ status: 200, type: [Patient] })
  @Permissions("patient:read")
  @OperationCode(PatientCodes.FIND_ALL_ERROR)
  @Get()
  findAll(@Query("q", QueryParamsPipe) params: QueryParams) {
    return this.patientService.findAll(params);
  }

  @ApiOperation({ summary: "Получение пациента по id" })
  @ApiResponse({ status: 200, type: Patient })
  @Permissions("patient:read")
  @OperationCode(PatientCodes.FIND_ONE_ERROR)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.patientService.findOne(+id);
  }

  @ApiOperation({ summary: "Получение всех исследований пациента по id" })
  @ApiResponse({ status: 200, type: [Study] })
  @Permissions("patient:read")
  @OperationCode(PatientCodes.FIND_ALL_STUDIES_ERROR)
  @Get(":id/studies")
  findAllStudies(@Param("id") id: string, @Query("q", QueryParamsPipe) params: QueryParams) {
    return this.patientService.findAllStudies(+id, params);
  }

  @ApiOperation({ summary: "Обновление пациента" })
  @ApiResponse({ status: 200, type: Patient })
  @Permissions("patient:update")
  @OperationCode(PatientCodes.UPDATE_ERROR)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePatientDto) {
    return this.patientService.update(+id, dto);
  }

  @ApiOperation({ summary: "Восстановление пациента по id после мягкого удаления" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("patient:delete")
  @OperationCode(PatientCodes.RESTORE_ERROR)
  @Patch(":id/restore")
  restore(@Param("id") id: string) {
    return this.patientService.restore(+id);
  }

  @ApiOperation({ summary: "Мягкое удаление пациента по id" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("patient:delete")
  @OperationCode(PatientCodes.REMOVE_ERROR)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.patientService.remove(+id);
  }

  @ApiOperation({ summary: "Жесткое удаление пациента по id" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("patient:delete")
  @OperationCode(PatientCodes.FORCE_REMOVE_ERROR)
  @Delete(":id/force")
  forceRemove(@Param("id") id: string) {
    return this.patientService.forceRemove(+id);
  }
}
