import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Permission } from "./entities/permission.entity";
import { Role } from "../roles/entities/role.entity";
import { FindOptions } from "sequelize";

import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { permissionQueryConfig, PermissionCodes } from "./contracts";

@Injectable()
export class PermissionService {
  constructor(@InjectModel(Permission) private repository: typeof Permission) {}

  async create(dto: CreatePermissionDto) {
    try {
      const permission = await this.repository.create(dto);

      const response = createResponse<Permission, PermissionCodes>();
      return response.success(PermissionCodes.CREATE_SUCCESS).data(permission).build();
    } catch (error) {
      const msg = `Ошибка при создании разрешения. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

    try {
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
    } catch (error) {
      const msg = `Ошибка при получении всех разрешений. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByRoleId(roleId: number, params: QueryParams) {
    console.log("params: ", params);

    try {
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
    } catch (error) {
      const msg = `Ошибка при получении всех разрешений. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Permission>, "where">) {
    const permission = await this.repository.findByPk(id, options);
    if (!permission) {
      throw new HttpException(`Разрешение не найдено.`, HttpStatus.NOT_FOUND);
    }
    return permission;
  }

  async findOne(id: number) {
    try {
      const permission = await this.findOneOrThrow(id);

      const response = createResponse<Permission, PermissionCodes>();
      return response.success(PermissionCodes.FIND_ONE_SUCCESS).data(permission).build();
    } catch (error) {
      const msg = `Ошибка при получении разрешения по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByValue(value: string) {
    try {
      const permission = await this.repository.findOne({ where: { value } });
      if (!permission) {
        throw new HttpException(`Разрешение не найдено.`, HttpStatus.NOT_FOUND);
      }

      return permission;
    } catch (error) {
      const msg = `Ошибка при получении разрешения по значению. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdatePermissionDto) {
    try {
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
    } catch (error) {
      const msg = `Ошибка при обновлении разрешения. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.repository.restore({ where: { id } });

      const response = createResponse<Boolean, PermissionCodes>();
      return response.success(PermissionCodes.REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при восстановлении разрешения после мягкого удаления. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: { id }, force: true });

      const response = createResponse<Boolean, PermissionCodes>();
      return response.success(PermissionCodes.FORCE_REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при жестком удалении разрешения. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: { id } });

      const response = createResponse<Boolean, PermissionCodes>();
      return response.success(PermissionCodes.RESTORE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при восстановлении разрешения после мягкого удаления. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async count() {
    try {
      return (await this.repository.findAndCountAll()).count;
    } catch (error) {
      const msg = `Ошибка подсчете разрешений. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
