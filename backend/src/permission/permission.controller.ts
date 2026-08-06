import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Permission } from "./entities/permission.entity";
import { Permissions } from "src/decorators/permissions.decorator";
import { QueryParams, QueryParamsPipe } from "../common/query";

@ApiBearerAuth("token")
@ApiTags("Разрешение")
@Controller("permissions")
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: "Создание разрешения" })
  @ApiResponse({ status: 200, type: Permission })
  @Permissions("permission:create")
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @ApiOperation({ summary: "Получение всех разрешений" })
  @ApiResponse({ status: 200, type: [Permission] })
  @Permissions("permission:read")
  @Get()
  findAll(@Query("q", QueryParamsPipe) params: QueryParams) {
    return this.permissionService.findAll(params);
  }

  @ApiOperation({ summary: "Получение разрешения по id" })
  @ApiResponse({ status: 200, type: Permission })
  @Permissions("permission:read")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.permissionService.findOne(+id);
  }

  @ApiOperation({ summary: "Обновление разрешения" })
  @ApiResponse({ status: 200, type: Permission })
  @Permissions("permission:update")
  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @ApiOperation({ summary: "Мягкое удаление разрешения" })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions("permission:delete")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.permissionService.remove(+id);
  }
}
