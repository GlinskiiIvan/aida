import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { User } from 'src/users/entities/user.entity';
import { FindAllQueryDto } from 'src/utils/dto/findAllQuery.dto';
import { buildFindAllParams } from 'src/utils';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { Permission } from 'src/permission/entities/permission.entity';

@ApiBearerAuth('token')
@ApiTags('Роли')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Создание роли' })
  @ApiResponse({ status: 200, type: Role })
  @Permissions('role:create')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Получение всех ролей' })
  @ApiResponse({ status: 200, type: [Role] })
  @Permissions('role:read')
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    const params = buildFindAllParams(query);
    return this.rolesService.findAll(params);
  }

  @ApiOperation({ summary: 'Получение роли по id' })
  @ApiResponse({ status: 200, type: Role })
  @Permissions('role:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Получение всех пользователей роли по id' })
  @ApiResponse({ status: 200, type: [User] })
  @Permissions('role:read')
  @Get(':id/users')
  findAllUsers(@Param('id') id: string) {
    return this.rolesService.findAllUsers(+id);
  }

  @ApiOperation({ summary: 'Получение всех разрешений роли по id' })
  @ApiResponse({ status: 200, type: [Permission] })
  @Permissions('role:read')
  @Get(':id/permissions')
  findAllPermissions(@Param('id') id: string) {
    return this.rolesService.findAllPermissions(+id);
  }

  @ApiOperation({ summary: 'Обновление роли' })
  @ApiResponse({ status: 200, type: Role })
  @Permissions('role:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Обновление разрешений роли' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('role:update')
  @Patch(':id/permissions')
  updatePermissions(@Param('id') id: string, @Body() dto: UpdatePermissionsDto) {
    return this.rolesService.updatePermissions(+id, dto);
  }

  @ApiOperation({ summary: 'Восстановление роли после мягкого удаления' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('role:delete')
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.rolesService.restore(+id);
  }

  @ApiOperation({ summary: 'Мягкое удаление роли' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('role:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @ApiOperation({ summary: 'Жесткое удаление роли' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('role:delete')
  @Delete(':id/force')
  forceRemove(@Param('id') id: string) {
    return this.rolesService.forceRemove(+id);
  }
}
