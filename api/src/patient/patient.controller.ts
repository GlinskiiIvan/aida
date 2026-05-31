import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Patient } from './entities/patient.entity';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Study } from 'src/study/entities/study.entity';
import { buildFindAllParams } from 'src/utils';
import { FindAllQueryDto } from 'src/utils/dto/findAllQuery.dto';

@ApiBearerAuth('token')
@ApiTags('Пациент')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({ summary: 'Создание пациента' })
  @ApiResponse({ status: 200, type: Patient })
  @Permissions('patient:create')
  @UseGuards(PermissionsGuard)
  @Post()
  create(@Body() dto: CreatePatientDto) {
    return this.patientService.create(dto);
  }

  @ApiOperation({ summary: 'Получение всех пациентов' })
  @ApiResponse({ status: 200, type: [Patient] })
  @Permissions('patient:read')
  @UseGuards(PermissionsGuard)
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    const params = buildFindAllParams(query);
    return this.patientService.findAll(params);
  }

  @ApiOperation({ summary: 'Получение пациента по id' })
  @ApiResponse({ status: 200, type: Patient })
  @Permissions('patient:read')
  @UseGuards(PermissionsGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получение всех исследований пациента по id' })
  @ApiResponse({ status: 200, type: [Study] })
  @Permissions('patient:read')
  @UseGuards(PermissionsGuard)
  @Get(':id/studies')
  findAllStudies(@Param('id') id: string, @Query() query: FindAllQueryDto) {
    const params = buildFindAllParams(query);
    return this.patientService.findAllStudies(+id, params);
  }

  @ApiOperation({ summary: 'Обновление пациента' })
  @ApiResponse({ status: 200, type: Patient })
  @Permissions('patient:update')
  @UseGuards(PermissionsGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Восстановление пациента по id после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('patient:delete')
  @UseGuards(PermissionsGuard)
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.patientService.restore(+id);
  }

  @ApiOperation({ summary: 'Мягкое удаление пациента по id' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('patient:delete')
  @UseGuards(PermissionsGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление пациента по id' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('patient:delete')
  @UseGuards(PermissionsGuard)
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.patientService.forceRemove(+id);
  }
}
