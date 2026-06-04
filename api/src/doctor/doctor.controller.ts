import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Doctor } from './entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { FindAllQueryDto } from 'src/utils/dto/findAllQuery.dto';
import { buildFindAllParams } from 'src/utils';

@ApiBearerAuth('token')
@ApiTags('Доктор')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiOperation({ summary: 'Создание доктора' })
  @ApiResponse({ status: 200, type: Doctor })
  @Permissions('doctor:create')
  @Post()
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorService.create(dto);
  }

  @ApiOperation({ summary: 'Получение всех докторов' })
  @ApiResponse({ status: 200, type: [Doctor] })
  @Permissions('doctor:read')
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    const params = buildFindAllParams(query);
    return this.doctorService.findAll(params);
  }

  @ApiOperation({ summary: 'Получение доктора по id' })
  @ApiResponse({ status: 200, type: Doctor })
  @Permissions('doctor:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(+id);
  }
  @ApiOperation({ summary: 'Получение всех пациентов доктора по id' })
  @ApiResponse({ status: 200, type: [Patient] })
  @Permissions('doctor:read')
  @Get(':id/patients')
  findAllPatients(@Param('id') id: string) {
    return this.doctorService.findAllPatients(+id);
  }

  @ApiOperation({ summary: 'Обновление доктора по id' })
  @ApiResponse({ status: 200, type: Doctor })
  @Permissions('doctor:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.doctorService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Востановление доктора по id после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('doctor:delete')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.doctorService.restore(+id);
  }
  
  @ApiOperation({ summary: 'Мягкое удаление доктора по id' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('doctor:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление доктора по id' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('doctor:delete')
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.doctorService.forceRemove(+id);
  }
}
