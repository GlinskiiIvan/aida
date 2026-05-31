import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Series } from './entities/series.entity';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { InstanceImage } from 'src/instance-image/entities/instance-image.entity';

@ApiBearerAuth('token')
@ApiTags('Серия')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @ApiOperation({ summary: 'Создание серии' })
  @ApiResponse({ status: 200, type: Series })
  @Permissions('series:create')
  @UseGuards(PermissionsGuard)
  @Post()
  create(@Body() dto: CreateSeriesDto) {
    return this.seriesService.create(dto);
  }

  @ApiOperation({ summary: 'Получение всех серий' })
  @ApiResponse({ status: 200, type: [Series] })
  @Permissions('series:read')
  @UseGuards(PermissionsGuard)
  @Get()
  findAll() {
    return this.seriesService.findAll();
  }

  @ApiOperation({ summary: 'Получение серии по id' })
  @ApiResponse({ status: 200, type: Series })
  @Permissions('series:read')
  @UseGuards(PermissionsGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получение всех изображений серии по id' })
  @ApiResponse({ status: 200, type: [InstanceImage] })
  @Permissions('series:read')
  @UseGuards(PermissionsGuard)
  @Get(':id/images')
  findAllImages(@Param('id') id: string) {
    return this.seriesService.findAllImages(+id);
  }

  @ApiOperation({ summary: 'Обновление серии' })
  @ApiResponse({ status: 200, type: Series })
  @Permissions('series:update')
  @UseGuards(PermissionsGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSeriesDto) {
    return this.seriesService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Восстановление серии после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('series:delete')
  @UseGuards(PermissionsGuard)
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.seriesService.restore(+id);
  }

  @ApiOperation({ summary: 'Мягкое удаление серии' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('series:delete')
  @UseGuards(PermissionsGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seriesService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление серии' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('series:delete')
  @UseGuards(PermissionsGuard)
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.seriesService.forceRemove(+id);
  }
}
