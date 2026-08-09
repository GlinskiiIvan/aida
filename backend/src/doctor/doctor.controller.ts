import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { DoctorService } from "./doctor.service";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Permissions } from "src/decorators/permissions.decorator";
import { Doctor } from "./entities/doctor.entity";
import { Patient } from "src/patient/entities/patient.entity";
import { QueryParams, QueryParamsPipe } from "../common/query";
import { OperationCode } from "src/decorators/operation-code.decorator";
import { DoctorCodes } from "./contracts/doctor.codes";

@ApiBearerAuth("token")
@ApiTags("Доктор")
@Controller("doctors")
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiOperation({ summary: "Создание доктора" })
  @ApiResponse({ status: 200, type: Doctor })
  @Permissions("doctor:create")
  @OperationCode(DoctorCodes.CREATE_ERROR)
  @Post()
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorService.create(dto);
  }

  @ApiOperation({ summary: "Получение всех докторов" })
  @ApiResponse({ status: 200, type: [Doctor] })
  @Permissions("doctor:read")
  @OperationCode(DoctorCodes.FIND_ALL_ERROR)
  @Get()
  findAll(@Query("q", QueryParamsPipe) params: QueryParams) {
    return this.doctorService.findAll(params);
  }

  @ApiOperation({ summary: "Получение доктора по id" })
  @ApiResponse({ status: 200, type: Doctor })
  @Permissions("doctor:read")
  @OperationCode(DoctorCodes.FIND_ONE_ERROR)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.doctorService.findOne(+id);
  }
  @ApiOperation({ summary: "Получение всех пациентов доктора по id" })
  @ApiResponse({ status: 200, type: [Patient] })
  @Permissions("doctor:read")
  @OperationCode(DoctorCodes.FIND_ALL_PATIENTS_ERROR)
  @Get(":id/patients")
  findAllPatients(@Param("id") id: string, @Query("q", QueryParamsPipe) params: QueryParams) {
    return this.doctorService.findAllPatients(+id, params);
  }

  @ApiOperation({ summary: "Обновление доктора по id" })
  @ApiResponse({ status: 200, type: Doctor })
  @Permissions("doctor:update")
  @OperationCode(DoctorCodes.UPDATE_ERROR)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateDoctorDto) {
    return this.doctorService.update(+id, dto);
  }

  @ApiOperation({ summary: "Востановление доктора по id после мягкого удаления" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("doctor:delete")
  @OperationCode(DoctorCodes.RESTORE_ERROR)
  @Patch(":id/restore")
  restore(@Param("id") id: string) {
    return this.doctorService.restore(+id);
  }

  @ApiOperation({ summary: "Мягкое удаление доктора по id" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("doctor:delete")
  @OperationCode(DoctorCodes.REMOVE_ERROR)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.doctorService.remove(+id);
  }

  @ApiOperation({ summary: "Жесткое удаление доктора по id" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("doctor:delete")
  @OperationCode(DoctorCodes.FORCE_REMOVE_ERROR)
  @Delete(":id/force")
  forceRemove(@Param("id") id: string) {
    return this.doctorService.forceRemove(+id);
  }
}
