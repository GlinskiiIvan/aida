import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./entities/user.entity";
import { UserRoleDto } from "./dto/user-role.dto";
import { UserBanDto } from "./dto/user-ban.dto";
import { Permissions } from "src/decorators/permissions.decorator";
import { Role } from "src/roles/entities/role.entity";
import { PredictionRun } from "src/prediction-run/entities/prediction-run.entity";
import { UpdateRolesDto } from "./dto/update-roles.dto";
import { QueryParams, QueryParamsPipe } from "../common/query";
import { OperationCode } from "src/decorators/operation-code.decorator";
import { UserCodes } from "./contracts";

@ApiBearerAuth("token")
@ApiTags("Пользователи")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Создание пользователя" })
  @ApiResponse({ status: 200, type: User })
  @Permissions("user:create")
  @OperationCode(UserCodes.CREATE_ERROR)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: "Выдача роли пользователю" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("user:update")
  @OperationCode(UserCodes.ADD_ROLE_ERROR)
  @Post("/role/add")
  addRole(@Body() userRoleDto: UserRoleDto) {
    return this.usersService.addRole(userRoleDto);
  }

  @ApiOperation({ summary: "Получение всех пользователей" })
  @ApiResponse({ status: 200, type: [User] })
  @Permissions("user:read")
  @OperationCode(UserCodes.FIND_ALL_ERROR)
  @Get()
  findAll(@Query("q", QueryParamsPipe) params: QueryParams) {
    return this.usersService.findAll(params);
  }

  @ApiOperation({ summary: "Получение пользователя по id" })
  @ApiResponse({ status: 200, type: User })
  @Permissions("user:read")
  @OperationCode(UserCodes.FIND_ONE_ERROR)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: "Получение всех ролей пользователя по id" })
  @ApiResponse({ status: 200, type: [Role] })
  @Permissions("user:read")
  @OperationCode(UserCodes.FIND_ALL_ROLES_ERROR)
  @Get(":id/roles")
  findAllRoles(@Param("id") id: string, @Query("q", QueryParamsPipe) params: QueryParams) {
    return this.usersService.findAllRoles(+id, params);
  }

  @ApiOperation({ summary: "Получение всех запусков предсказаний пользователя по id" })
  @ApiResponse({ status: 200, type: [PredictionRun] })
  @Permissions("user:read")
  @OperationCode(UserCodes.FIND_ALL_RUNS_ERROR)
  @Get(":id/runs")
  findAllRuns(@Param("id") id: string, @Query("q", QueryParamsPipe) params: QueryParams) {
    return this.usersService.findAllRuns(+id, params);
  }

  @ApiOperation({ summary: "Бан пользователя" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("user:update")
  @OperationCode(UserCodes.BAN_ERROR)
  @Patch("/ban")
  ban(@Body() userBanDto: UserBanDto) {
    return this.usersService.ban(userBanDto);
  }

  @ApiOperation({ summary: "Обновление пользователя" })
  @ApiResponse({ status: 200, type: User })
  @Permissions("user:update")
  @OperationCode(UserCodes.UPDATE_ERROR)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(+id, dto);
  }

  @ApiOperation({ summary: "Обновление ролей пользователя" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("user:update")
  @OperationCode(UserCodes.UPDATE_ROLES_ERROR)
  @Patch(":id/roles")
  updateRoles(@Param("id") id: string, @Body() dto: UpdateRolesDto) {
    return this.usersService.updateRoles(+id, dto);
  }

  @ApiOperation({ summary: "Снятие бана с пользователя" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("user:update")
  @OperationCode(UserCodes.UNBAN_ERROR)
  @Patch(":id/unban")
  unban(@Param("id") id: string) {
    return this.usersService.unban(+id);
  }

  @ApiOperation({ summary: "Восстановление пользователя после мягкого удаления" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("user:delete")
  @OperationCode(UserCodes.RESTORE_ERROR)
  @Patch(":id/restore")
  restore(@Param("id") id: string) {
    return this.usersService.restore(+id);
  }

  @ApiOperation({ summary: "Удаление роли у пользователя" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("user:update")
  @OperationCode(UserCodes.REMOVE_ROLE_ERROR)
  @Delete("/role/remove")
  removeRole(@Body() userRoleDto: UserRoleDto) {
    return this.usersService.removeRole(userRoleDto);
  }

  @ApiOperation({ summary: "Мягкое удаление пользователя" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("user:delete")
  @OperationCode(UserCodes.REMOVE_ERROR)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({ summary: "Жесткое удаление пользователя" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("user:delete")
  @OperationCode(UserCodes.FORCE_REMOVE_ERROR)
  @Delete(":id/force")
  forceRemove(@Param("id") id: string) {
    return this.usersService.forceRemove(+id);
  }
}
