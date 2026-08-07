import { forwardRef, HttpException, HttpStatus, Injectable, Inject } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./entities/user.entity";
import { RolesService } from "src/roles/roles.service";
import { Role } from "src/roles/entities/role.entity";
import { UserRoleDto } from "./dto/user-role.dto";
import { UserBanDto } from "./dto/user-ban.dto";
import { FindOptions, Includeable } from "sequelize";
import { UpdateRolesDto } from "./dto/update-roles.dto";

import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { userQueryConfig, UserCodes } from "./contracts";
import { PredictionRunService } from "src/prediction-run/prediction-run.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private repository: typeof User,
    @Inject(forwardRef(() => RolesService)) private roleService: RolesService,
    private predictionRunService: PredictionRunService,
  ) {}

  private includeRoles: Includeable = {
    model: Role,
    as: "roles",
    attributes: ["id", "value"],
    through: { attributes: [] },
  };

  async create(dto: CreateUserDto) {
    try {
      const user = await this.repository.create(dto);

      const response = createResponse<User, UserCodes>();
      return response.success(UserCodes.CREATE_SUCCESS).data(user).build();
    } catch (error) {
      const msg = `Ошибка при создании пользователя. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      const [_, updatedRows] = await this.repository.update(dto, {
        where: { id },
        returning: true,
      });

      const response = createResponse<User, UserCodes>();
      return response.success(UserCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
    } catch (error) {
      const msg = `Ошибка при обновлении пользователя. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async updateRoles(userId: number, dto: UpdateRolesDto) {
    try {
      const user = await this.findOneOrThrow(userId);
      await user.$set("roles", dto.roles);

      const response = createResponse<Boolean, UserCodes>();
      return response.success(UserCodes.UPDATE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при обновлении ролей пользователя. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: { id } });

      const response = createResponse<Boolean, UserCodes>();
      return response.success(UserCodes.RESTORE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при восстановлении пользователя после мягкого удаления. ${error.message}`;
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
        userQueryConfig,
        params,
        options,
      );

      const response = createResponse<User[], UserCodes>();
      return response
        .success(UserCodes.FIND_ALL_SUCCESS)
        .data(data)
        .pagination(
          resolvedPageination.total,
          resolvedPageination.page_size,
          resolvedPageination.page,
        )
        .build();
    } catch (error) {
      const msg = `Ошибка при получении всех пользователей. ${error.message}`;
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
        order: [["created_at", "DESC"]],
      };

      const { data, resolvedPageination } = await executeQueryResponse(
        this.repository,
        userQueryConfig,
        params,
        options,
      );

      const response = createResponse<User[], UserCodes>();
      return response
        .success(UserCodes.FIND_ALL_BY_ROLE_ID_SUCCESS)
        .data(data)
        .pagination(
          resolvedPageination.total,
          resolvedPageination.page_size,
          resolvedPageination.page,
        )
        .build();
    } catch (error) {
      const msg = `Ошибка при получении всех пользователей. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllRoles(id: number, params: QueryParams) {
    try {
      const user = await this.findOneOrThrow(id);
      const roles = await this.roleService.findAllByUserId(id, params);

      return roles;
    } catch (error) {
      const msg = `Ошибка при получении всех ролей пользователя по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllRuns(id: number, params: QueryParams) {
    try {
      const user = await this.findOneOrThrow(id);
      const runs = await this.predictionRunService.findAllByUserId(id, params);

      return runs;
    } catch (error) {
      const msg = `Ошибка при получении всех запусков предсказаний пользователя по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<User>, "where">) {
    const user = await this.repository.findByPk(id, options);
    if (!user) {
      throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOne(id: number) {
    try {
      const user = await this.findOneOrThrow(id, {
        include: [this.includeRoles],
      });

      const response = createResponse<User, UserCodes>();
      return response.success(UserCodes.FIND_ONE_SUCCESS).data(user).build();
    } catch (error) {
      const msg = `Ошибка при получении пользователя по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.repository.findOne({
        where: { email },
        include: [this.includeRoles],
      });
      return user;
    } catch (error) {
      const msg = `Ошибка при получении пользователя по email. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({ where: { id } });

      const response = createResponse<Boolean, UserCodes>();
      return response.success(UserCodes.REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при мягком удалении пользователя. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: { id }, force: true });

      const response = createResponse<Boolean, UserCodes>();
      return response.success(UserCodes.FORCE_REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при жестком удалении пользователя. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async addRole(dto: UserRoleDto) {
    try {
      const user = await this.findOneOrThrow(dto.userId);
      const role = await this.roleService.findOneOrThrow(dto.roleId);
      await user.$add("roles", role.id);

      const response = createResponse<Boolean, UserCodes>();
      return response.success(UserCodes.ADD_ROLE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при добавлении роли пользователю. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async removeRole(dto: UserRoleDto) {
    try {
      const user = await this.findOneOrThrow(dto.userId);
      const role = await this.roleService.findOneOrThrow(dto.roleId);
      await user.$remove("roles", role.id);

      const response = createResponse<Boolean, UserCodes>();
      return response.success(UserCodes.REMOVE_ROLE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при удалении роли у пользователя. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async ban(dto: UserBanDto) {
    try {
      const user = await this.findOneOrThrow(dto.userId);

      user.banned = true;
      user.banReason = dto.banReason;
      await user.save();

      const response = createResponse<Boolean, UserCodes>();
      return response.success(UserCodes.BAN_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при бане пользователя. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async unban(id: number) {
    try {
      const user = await this.findOneOrThrow(id);

      user.banned = false;
      user.banReason = null;
      await user.save();

      const response = createResponse<Boolean, UserCodes>();
      return response.success(UserCodes.UNBAN_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при снятии бана с пользователя. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async count() {
    try {
      return (await this.repository.findAndCountAll()).count;
    } catch (error) {
      const msg = `Ошибка подсчете пользователей. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
