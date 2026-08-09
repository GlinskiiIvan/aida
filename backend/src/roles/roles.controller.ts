import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "./entities/role.entity";
import { Permissions } from "src/decorators/permissions.decorator";
import { User } from "src/users/entities/user.entity";
import { UpdatePermissionsDto } from "./dto/update-permissions.dto";
import { Permission } from "src/permission/entities/permission.entity";
import { QueryParams, QueryParamsPipe } from "../common/query";
import { OperationCode } from "src/decorators/operation-code.decorator";
import { RoleCodes } from "./contracts";

@ApiBearerAuth("token")
@ApiTags("Роли")
@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: "Создание роли" })
  @ApiResponse({ status: 200, type: Role })
  @Permissions("role:create")
  @OperationCode(RoleCodes.CREATE_ERROR)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: "Получение всех ролей" })
  @ApiResponse({ status: 200, type: [Role] })
  @Permissions("role:read")
  @OperationCode(RoleCodes.FIND_ALL_ERROR)
  @Get()
  findAll(@Query("q", QueryParamsPipe) params: QueryParams) {
    return this.rolesService.findAll(params);
  }

  @ApiOperation({ summary: "Получение роли по id" })
  @ApiResponse({ status: 200, type: Role })
  @Permissions("role:read")
  @OperationCode(RoleCodes.FIND_ONE_ERROR)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiOperation({ summary: "Получение всех пользователей роли по id" })
  @ApiResponse({ status: 200, type: [User] })
  @Permissions("role:read")
  @OperationCode(RoleCodes.FIND_ALL_USERS_ERROR)
  @Get(":id/users")
  findAllUsers(@Param("id") id: string, @Query("q", QueryParamsPipe) params: QueryParams) {
    return this.rolesService.findAllUsers(+id, params);
  }

  @ApiOperation({ summary: "Получение всех разрешений роли по id" })
  @ApiResponse({ status: 200, type: [Permission] })
  @Permissions("role:read")
  @OperationCode(RoleCodes.UPDATE_PERMISSIONS_ERROR)
  @Get(":id/permissions")
  findAllPermissions(@Param("id") id: string, @Query("q", QueryParamsPipe) params: QueryParams) {
    return this.rolesService.findAllPermissions(+id, params);
  }

  @ApiOperation({ summary: "Обновление роли" })
  @ApiResponse({ status: 200, type: Role })
  @Permissions("role:update")
  @OperationCode(RoleCodes.UPDATE_ERROR)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: "Обновление разрешений роли" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("role:update")
  @OperationCode(RoleCodes.UPDATE_PERMISSIONS_ERROR)
  @Patch(":id/permissions")
  updatePermissions(@Param("id") id: string, @Body() dto: UpdatePermissionsDto) {
    return this.rolesService.updatePermissions(+id, dto);
  }

  @ApiOperation({ summary: "Восстановление роли после мягкого удаления" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("role:delete")
  @OperationCode(RoleCodes.RESTORE_ERROR)
  @Patch(":id/restore")
  restore(@Param("id") id: string) {
    return this.rolesService.restore(+id);
  }

  @ApiOperation({ summary: "Мягкое удаление роли" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("role:delete")
  @OperationCode(RoleCodes.REMOVE_ERROR)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.rolesService.remove(+id);
  }

  @ApiOperation({ summary: "Жесткое удаление роли" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("role:delete")
  @OperationCode(RoleCodes.FORCE_REMOVE_ERROR)
  @Delete(":id/force")
  forceRemove(@Param("id") id: string) {
    return this.rolesService.forceRemove(+id);
  }
}
