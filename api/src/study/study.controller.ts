import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { StudyService } from './study.service';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Study } from './entities/study.entity';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Series } from 'src/series/entities/series.entity';
import { PredictionRun } from 'src/prediction-run/entities/prediction-run.entity';
import { FindAllQueryDto } from 'src/utils/dto/findAllQuery.dto';
import { buildFindAllParams } from 'src/utils';
import { InstanceImage } from 'src/instance-image/entities/instance-image.entity';

@ApiBearerAuth('token')
@ApiTags('Исследование')
@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @ApiOperation({ summary: 'Создание исследования' })
  @ApiResponse({ status: 200, type: Study })
  @Permissions('study:create')
  @UseGuards(PermissionsGuard)
  @Post()
  create(@Body() dto: CreateStudyDto) {
    return this.studyService.create(dto);
  }

  @ApiOperation({ summary: 'Получение всех исследований' })
  @ApiResponse({ status: 200, type: [Study] })
  @Permissions('study:read')
  @UseGuards(PermissionsGuard)
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    const params = buildFindAllParams(query);
    return this.studyService.findAll(params);
  }

  @ApiOperation({ summary: 'Получение исследования по id' })
  @ApiResponse({ status: 200, type: Study })
  @Permissions('study:read')
  @UseGuards(PermissionsGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studyService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получение всех серий исследования по id' })
  @ApiResponse({ status: 200, type: [Series] })
  @Permissions('study:read')
  @UseGuards(PermissionsGuard)
  @Get(':id/series')
  findAllSeries(@Param('id') id: string) {
    return this.studyService.findAllSeries(+id);
  }

  @ApiOperation({ summary: 'Получение всех запусков предсказаний исследования по id' })
  @ApiResponse({ status: 200, type: [PredictionRun] })
  @Permissions('study:read')
  @UseGuards(PermissionsGuard)
  @Get(':id/runs')
  findAllRuns(@Param('id') id: string, @Query() query: FindAllQueryDto) {
    const params = buildFindAllParams(query);
    return this.studyService.findAllRuns(+id, params);
  }

  @ApiOperation({ summary: 'Получение всех изображений исследования по id' })
  @ApiResponse({ status: 200, type: [InstanceImage] })
  @Permissions('study:read')
  @UseGuards(PermissionsGuard)
  @Get(':id/images')
  findAllImages(@Param('id') id: string, @Query() query: FindAllQueryDto) {
    const params = buildFindAllParams(query);
    return this.studyService.findAllImages(+id, params);
  }

  @ApiOperation({ summary: 'Обновление исследования' })
  @ApiResponse({ status: 200, type: Study })
  @Permissions('study:update')
  @UseGuards(PermissionsGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudyDto) {
    return this.studyService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Восстановление исследования после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('study:delete')
  @UseGuards(PermissionsGuard)
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.studyService.restore(+id);
  }

  @ApiOperation({ summary: 'Мягкое удаление исследования' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('study:delete')
  @UseGuards(PermissionsGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studyService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление исследования' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('study:delete')
  @UseGuards(PermissionsGuard)
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.studyService.forceRemove(+id);
  }
}
