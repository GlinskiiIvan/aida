import { forwardRef, HttpStatus, Injectable, Inject } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { FindOptions } from "sequelize";
import { UpdatePermissionsDto } from "./dto/update-permissions.dto";

import { AppException } from "src/exceptions/app.exception";
import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { roleQueryConfig, RoleCodes } from "./contracts";
import { PermissionService } from "src/permission/permission.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private repository: typeof Role,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    private permissionService: PermissionService,
  ) {}

  async create(dto: CreateRoleDto) {
    const candidate = await this.repository.findOne({
      where: { description: dto.description },
    });

    if (candidate) {
      throw new AppException({
        status: HttpStatus.BAD_REQUEST,
        code: RoleCodes.CREATE_ERROR,
      });
    }

    const role = await this.repository.create(dto);

    const response = createResponse<Role, RoleCodes>();
    return response.success(RoleCodes.CREATE_SUCCESS).data(role).build();
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      order: [["created_at", "DESC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      roleQueryConfig,
      params,
      options,
    );

    const response = createResponse<Role[], RoleCodes>();
    return response
      .success(RoleCodes.FIND_ALL_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }

  async findAllByUserId(userId: number, params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      include: [
        {
          model: User,
          as: "users",
          where: { id: userId },
          through: { attributes: [] },
          required: true,
        },
      ],
      order: [["created_at", "DESC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      roleQueryConfig,
      params,
      options,
    );

    const response = createResponse<Role[], RoleCodes>();
    return response
      .success(RoleCodes.FIND_ALL_BY_USER_ID_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }

  async findAllUsers(id: number, params: QueryParams) {
    const role = await this.findOneOrThrow(id);
    const users = await this.userService.findAllByRoleId(id, params);

    return users;
  }

  async findAllPermissions(roleId: number, params: QueryParams) {
    const role = await this.findOneOrThrow(roleId);
    const permissions = await this.permissionService.findAllByRoleId(roleId, params);

    return permissions;
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Role>, "where">) {
    const role = await this.repository.findByPk(id, options);
    if (!role) {
      throw new AppException({
        status: HttpStatus.NOT_FOUND,
        code: RoleCodes.FIND_ONE_OR_THROW_ERROR,
      });
    }
    return role;
  }

  async findOne(id: number) {
    const role = await this.findOneOrThrow(id);

    const response = createResponse<Role, RoleCodes>();
    return response.success(RoleCodes.FIND_ONE_SUCCESS).data(role).build();
  }

  async findOneByValue(value: string) {
    return await this.repository.findOne({ where: { value } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.findOneOrThrow(id);
    const [_, updatedRows] = await this.repository.update(updateRoleDto, {
      where: { id },
      returning: true,
    });

    const response = createResponse<Role, RoleCodes>();
    return response.success(RoleCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
  }

  async updatePermissions(role_id: number, dto: UpdatePermissionsDto) {
    const role = await this.findOneOrThrow(role_id);
    await role.$set("permissions", dto.permissions);

    const response = createResponse<Boolean, RoleCodes>();
    return response.success(RoleCodes.UPDATE_PERMISSIONS_SUCCESS).data(true).build();
  }

  async restore(id: number) {
    await this.repository.restore({ where: { id } });

    const response = createResponse<Boolean, RoleCodes>();
    return response.success(RoleCodes.RESTORE_SUCCESS).data(true).build();
  }

  async remove(id: number) {
    await this.findOneOrThrow(id);
    await this.repository.destroy({ where: { id } });

    const response = createResponse<Boolean, RoleCodes>();
    return response.success(RoleCodes.REMOVE_SUCCESS).data(true).build();
  }

  async forceRemove(id: number) {
    await this.repository.destroy({ where: { id }, force: true });

    const response = createResponse<Boolean, RoleCodes>();
    return response.success(RoleCodes.FORCE_REMOVE_SUCCESS).data(true).build();
  }

  async count() {
    return (await this.repository.findAndCountAll()).count;
  }
}
