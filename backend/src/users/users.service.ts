import { forwardRef, HttpStatus, Injectable, Inject } from "@nestjs/common";
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

import { AppException } from "src/exceptions/app.exception";
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
    const user = await this.repository.create(dto);

    const response = createResponse<User, UserCodes>();
    return response.success(UserCodes.CREATE_SUCCESS).data(user).build();
  }

  async update(id: number, dto: UpdateUserDto) {
    const [_, updatedRows] = await this.repository.update(dto, {
      where: { id },
      returning: true,
    });

    const response = createResponse<User, UserCodes>();
    return response.success(UserCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
  }

  async updateRoles(userId: number, dto: UpdateRolesDto) {
    const user = await this.findOneOrThrow(userId);
    await user.$set("roles", dto.roles);

    const response = createResponse<Boolean, UserCodes>();
    return response.success(UserCodes.UPDATE_SUCCESS).data(true).build();
  }

  async restore(id: number) {
    await this.repository.restore({ where: { id } });

    const response = createResponse<Boolean, UserCodes>();
    return response.success(UserCodes.RESTORE_SUCCESS).data(true).build();
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

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
  }

  async findAllRoles(id: number, params: QueryParams) {
    const user = await this.findOneOrThrow(id);
    const roles = await this.roleService.findAllByUserId(id, params);

    return roles;
  }

  async findAllRuns(id: number, params: QueryParams) {
    const user = await this.findOneOrThrow(id);
    const runs = await this.predictionRunService.findAllByUserId(id, params);

    return runs;
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<User>, "where">) {
    const user = await this.repository.findByPk(id, options);
    if (!user) {
      throw new AppException({
        status: HttpStatus.NOT_FOUND,
        code: UserCodes.FIND_ONE_OR_THROW_ERROR,
      });
    }
    return user;
  }

  async findOne(id: number) {
    const user = await this.findOneOrThrow(id, {
      include: [this.includeRoles],
    });

    const response = createResponse<User, UserCodes>();
    return response.success(UserCodes.FIND_ONE_SUCCESS).data(user).build();
  }

  async findOneByEmail(email: string) {
    const user = await this.repository.findOne({
      where: { email },
      include: [this.includeRoles],
    });
    return user;
  }

  async remove(id: number) {
    await this.findOneOrThrow(id);
    await this.repository.destroy({ where: { id } });

    const response = createResponse<Boolean, UserCodes>();
    return response.success(UserCodes.REMOVE_SUCCESS).data(true).build();
  }

  async forceRemove(id: number) {
    await this.repository.destroy({ where: { id }, force: true });

    const response = createResponse<Boolean, UserCodes>();
    return response.success(UserCodes.FORCE_REMOVE_SUCCESS).data(true).build();
  }

  async addRole(dto: UserRoleDto) {
    const user = await this.findOneOrThrow(dto.userId);
    const role = await this.roleService.findOneOrThrow(dto.roleId);
    await user.$add("roles", role.id);

    const response = createResponse<Boolean, UserCodes>();
    return response.success(UserCodes.ADD_ROLE_SUCCESS).data(true).build();
  }

  async removeRole(dto: UserRoleDto) {
    const user = await this.findOneOrThrow(dto.userId);
    const role = await this.roleService.findOneOrThrow(dto.roleId);
    await user.$remove("roles", role.id);

    const response = createResponse<Boolean, UserCodes>();
    return response.success(UserCodes.REMOVE_ROLE_SUCCESS).data(true).build();
  }

  async ban(dto: UserBanDto) {
    const user = await this.findOneOrThrow(dto.userId);

    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();

    const response = createResponse<Boolean, UserCodes>();
    return response.success(UserCodes.BAN_SUCCESS).data(true).build();
  }

  async unban(id: number) {
    const user = await this.findOneOrThrow(id);

    user.banned = false;
    user.banReason = null;
    await user.save();

    const response = createResponse<Boolean, UserCodes>();
    return response.success(UserCodes.UNBAN_SUCCESS).data(true).build();
  }

  async count() {
    return (await this.repository.findAndCountAll()).count;
  }
}
