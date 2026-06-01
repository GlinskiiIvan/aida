import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InstanceImageService } from './instance-image.service';
import { CreateInstanceImageDto } from './dto/create-instance-image.dto';
import { UpdateInstanceImageDto } from './dto/update-instance-image.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { InstanceImage } from './entities/instance-image.entity';
import { Prediction } from 'src/prediction/entities/prediction.entity';

@ApiBearerAuth('token')
@ApiTags('Инстанс изображения')
@Controller('instance-image')
export class InstanceImageController {
  constructor(private readonly instanceImageService: InstanceImageService) {}

  @ApiOperation({ summary: 'Создание инстанса изображения' })
  @ApiResponse({ status: 200, type: InstanceImage })
  @Permissions('instance-image:create')
  @Post()
  create(@Body() createInstanceImageDto: CreateInstanceImageDto) {
    return this.instanceImageService.create(createInstanceImageDto);
  }

  @ApiOperation({ summary: 'Получение всех инстансов изображений' })
  @ApiResponse({ status: 200, type: [InstanceImage] })
  @Permissions('instance-image:read')
  @Get()
  findAll() {
    return this.instanceImageService.findAll();
  }

  @ApiOperation({ summary: 'Получение инстанса изображения по id' })
  @ApiResponse({ status: 200, type: InstanceImage })
  @Permissions('instance-image:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instanceImageService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получение всех предсказаний инстанса изображения' })
  @ApiResponse({ status: 200, type: [Prediction] })
  @Permissions('instance-image:read')
  @Get(':id')
  findAllPredictions(@Param('id') id: string) {
    return this.instanceImageService.findAllPredictions(+id);
  }

  @ApiOperation({ summary: 'Обновление инстанса изображения' })
  @ApiResponse({ status: 200, type: InstanceImage })
  @Permissions('instance-image:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstanceImageDto: UpdateInstanceImageDto) {
    return this.instanceImageService.update(+id, updateInstanceImageDto);
  }

  @ApiOperation({ summary: 'Восстановление инстанса изображения после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('instance-image:delete')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.instanceImageService.restore(+id);
  }

  @ApiOperation({ summary: 'Мягкое удаление инстанса изображения' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('instance-image:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instanceImageService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление инстанса изображения' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('instance-image:delete')
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.instanceImageService.forceRemove(+id);
  }
}
