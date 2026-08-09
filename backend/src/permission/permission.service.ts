import { HttpStatus, Injectable } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Permission } from "./entities/permission.entity";
import { Role } from "../roles/entities/role.entity";
import { FindOptions } from "sequelize";

import { AppException } from "src/exceptions/app.exception";
import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { permissionQueryConfig, PermissionCodes } from "./contracts";

@Injectable()
export class PermissionService {
  constructor(@InjectModel(Permission) private repository: typeof Permission) {}

  async create(dto: CreatePermissionDto) {
    const permission = await this.repository.create(dto);

    const response = createResponse<Permission, PermissionCodes>();
    return response.success(PermissionCodes.CREATE_SUCCESS).data(permission).build();
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      order: [["created_at", "DESC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      permissionQueryConfig,
      params,
      options,
    );

    const response = createResponse<Permission[], PermissionCodes>();
    return response
      .success(PermissionCodes.FIND_ALL_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }

  async findAllByRoleId(roleId: number, params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      include: [
        {
          model: Role,
          as: "roles",
          where: { id: roleId },
          through: { attributes: [] },
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      permissionQueryConfig,
      params,
      options,
    );

    const response = createResponse<Permission[], PermissionCodes>();
    return response
      .success(PermissionCodes.FIND_ALL_BY_ROLE_ID_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Permission>, "where">) {
    const permission = await this.repository.findByPk(id, options);
    if (!permission) {
      throw new AppException({
        status: HttpStatus.NOT_FOUND,
        code: PermissionCodes.FIND_ONE_OR_THROW_ERROR,
      });
    }
    return permission;
  }

  async findOne(id: number) {
    const permission = await this.findOneOrThrow(id);

    const response = createResponse<Permission, PermissionCodes>();
    return response.success(PermissionCodes.FIND_ONE_SUCCESS).data(permission).build();
  }

  async findOneByValue(value: string) {
    const permission = await this.repository.findOne({ where: { value } });
    if (!permission) {
      throw new AppException({
        status: HttpStatus.NOT_FOUND,
        code: PermissionCodes.FIND_ONE_BY_VALUE_ERROR,
      });
    }

    return permission;
  }

  async update(id: number, dto: UpdatePermissionDto) {
    await this.findOneOrThrow(id);
    const [_, updatedRows] = await this.repository.update(
      {
        ...dto,
      },
      {
        where: { id },
        returning: true,
      },
    );

    const response = createResponse<Permission, PermissionCodes>();
    return response.success(PermissionCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
  }

  async remove(id: number) {
    await this.repository.restore({ where: { id } });

    const response = createResponse<Boolean, PermissionCodes>();
    return response.success(PermissionCodes.REMOVE_SUCCESS).data(true).build();
  }

  async forceRemove(id: number) {
    await this.repository.destroy({ where: { id }, force: true });

    const response = createResponse<Boolean, PermissionCodes>();
    return response.success(PermissionCodes.FORCE_REMOVE_SUCCESS).data(true).build();
  }

  async restore(id: number) {
    await this.repository.restore({ where: { id } });

    const response = createResponse<Boolean, PermissionCodes>();
    return response.success(PermissionCodes.RESTORE_SUCCESS).data(true).build();
  }

  async count() {
    return (await this.repository.findAndCountAll()).count;
  }
}
