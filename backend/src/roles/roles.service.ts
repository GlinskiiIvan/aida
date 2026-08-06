import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { FindOptions } from "sequelize";
import { UpdatePermissionsDto } from "./dto/update-permissions.dto";

import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { roleQueryConfig, RoleCodes } from "./contracts";
import { PermissionService } from "src/permission/permission.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private repository: typeof Role,
    private permissionService: PermissionService,
    private userService: UsersService,
  ) {}

  async create(dto: CreateRoleDto) {
    const candidate = await this.repository.findOne({
      where: { description: dto.description },
    });

    if (candidate) {
      throw new HttpException(
        "Ошибка при создании роли. Роль с таким описанием уже существует.",
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const role = await this.repository.create(dto);

      const response = createResponse<Role, RoleCodes>();
      return response.success(RoleCodes.CREATE_SUCCESS).data(role).build();
    } catch (error) {
      const msg = `Ошибка при создании роли. ${error.message}`;
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
    } catch (error) {
      const msg = `Ошибка при получении всех ролей. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByUserId(userId: number, params: QueryParams) {
    console.log("params: ", params);

    try {
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
    } catch (error) {
      const msg = `Ошибка при получении всех ролей. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllUsers(id: number, params: QueryParams) {
    try {
      const role = await this.findOneOrThrow(id);
      const users = await this.userService.findAllByRoleId(id, params);

      return users;
    } catch (error) {
      const msg = `Ошибка при получении всех пользователей роли. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllPermissions(roleId: number, params: QueryParams) {
    try {
      const role = await this.findOneOrThrow(roleId);
      const permissions = await this.permissionService.findAllByRoleId(roleId, params);

      return permissions;
    } catch (error) {
      const msg = `Ошибка при получении разрешений роли по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Role>, "where">) {
    const role = await this.repository.findByPk(id, options);
    if (!role) {
      throw new HttpException("Роль не найдена.", HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async findOne(id: number) {
    try {
      const role = await this.findOneOrThrow(id);

      const response = createResponse<Role, RoleCodes>();
      return response.success(RoleCodes.FIND_ONE_SUCCESS).data(role).build();
    } catch (error) {
      const msg = `Ошибка при получении роли по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByValue(value: string) {
    try {
      return await this.repository.findOne({ where: { value } });
    } catch (error) {
      const msg = `Ошибка при получении роли по значению. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(updateRoleDto, {
        where: { id },
        returning: true,
      });

      const response = createResponse<Role, RoleCodes>();
      return response.success(RoleCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
    } catch (error) {
      const msg = `Ошибка при обновлении роли. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async updatePermissions(role_id: number, dto: UpdatePermissionsDto) {
    try {
      const role = await this.findOneOrThrow(role_id);
      await role.$set("permissions", dto.permissions);

      const response = createResponse<Boolean, RoleCodes>();
      return response.success(RoleCodes.UPDATE_PERMISSIONS_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при обновлении роли. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: { id } });

      const response = createResponse<Boolean, RoleCodes>();
      return response.success(RoleCodes.RESTORE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при восстановлении после мягкого удаления роли. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({ where: { id } });

      const response = createResponse<Boolean, RoleCodes>();
      return response.success(RoleCodes.REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при мягком удалении роли. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: { id }, force: true });

      const response = createResponse<Boolean, RoleCodes>();
      return response.success(RoleCodes.FORCE_REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при жестком удалении роли. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async count() {
    try {
      return (await this.repository.findAndCountAll()).count;
    } catch (error) {
      const msg = `Ошибка подсчете ролей. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
