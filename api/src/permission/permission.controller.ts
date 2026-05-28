import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FindAllQueryDto } from 'src/utils/dto/findAllQuery.dto';
import { buildFindAllParams } from 'src/utils';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Permission } from './entities/permission.entity';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiBearerAuth('token')
@ApiTags('Разрешение')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'Создание разрешения' })
  @ApiResponse({ status: 200, type: Permission })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @ApiOperation({ summary: 'Получение всех разрешений' })
  @ApiResponse({ status: 200, type: [Permission] })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    const params = buildFindAllParams(query);
    return this.permissionService.findAll(params);
  }

  @ApiOperation({ summary: 'Получение разрешения по id' })
  @ApiResponse({ status: 200, type: Permission })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновление разрешения' })
  @ApiResponse({ status: 200, type: Permission })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @ApiOperation({ summary: 'Мягкое удаление разрешения' })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
