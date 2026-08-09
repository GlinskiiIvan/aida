import { buildFindAllParams, type FindAllParams } from "../utils";
import { api } from "../api/api";
import type { Role } from "./role";
import { type ResponseEnvelope, enums } from "../../common/response";

export interface CreateUserDto {
  readonly email: string;
  readonly password: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: number;
}

export interface UpdateRolesDto {
  readonly id: number;
  readonly roles: number[];
}

export type User = {
  id: number;
  email: string;
  password: string;
  banned: boolean;
  banReason: string;
  refreshToken: string;
  deletedAt: string;
};

export enum UserCodes {
  CREATE_SUCCESS = "user.create.success",
  CREATE_ERROR = "user.create.error",

  FIND_ALL_SUCCESS = "user.findAll.success",
  FIND_ALL_ERROR = "user.findAll.error",

  FIND_ALL_BY_ROLE_ID_SUCCESS = "user.findAllByRoleId.success",
  FIND_ALL_BY_ROLE_ID_ERROR = "user.findAllByRoleId.error",

  FIND_ONE_SUCCESS = "user.findOne.success",
  FIND_ONE_ERROR = "user.findOne.error",

  FIND_ONE_OR_THROW_SUCCESS = "user.findOneOrThrow.success",
  FIND_ONE_OR_THROW_ERROR = "user.findOneOrThrow.error",

  UPDATE_SUCCESS = "user.update.success",
  UPDATE_ERROR = "user.update.error",

  REMOVE_SUCCESS = "user.remove.success",
  REMOVE_ERROR = "user.remove.error",

  FORCE_REMOVE_SUCCESS = "user.forceRemove.success",
  FORCE_REMOVE_ERROR = "user.forceRemove.error",

  RESTORE_SUCCESS = "user.restore.success",
  RESTORE_ERROR = "user.restore.error",

  UPDATE_ROLES_SUCCESS = "user.updateRoles.success",
  UPDATE_ROLES_ERROR = "user.updateRoles.error",

  FIND_ONE_BY_EMAIL_SUCCESS = "user.findOneByEmail.success",
  FIND_ONE_BY_EMAIL_ERROR = "user.findOneByEmail.error",

  FIND_ALL_ROLES_SUCCESS = "user.findAllRoles.success",
  FIND_ALL_ROLES_ERROR = "user.findAllRoles.error",

  FIND_ALL_RUNS_SUCCESS = "user.findAllRuns.success",
  FIND_ALL_RUNS_ERROR = "user.findAllRuns.error",

  ADD_ROLE_SUCCESS = "user.addRole.success",
  ADD_ROLE_ERROR = "user.addRole.error",

  REMOVE_ROLE_SUCCESS = "user.removeRole.success",
  REMOVE_ROLE_ERROR = "user.removeRole.error",

  BAN_SUCCESS = "user.ban.success",
  BAN_ERROR = "user.ban.error",

  UNBAN_SUCCESS = "user.unban.success",
  UNBAN_ERROR = "user.unban.error",

  COUNT_SUCCESS = "user.count.success",
  COUNT_ERROR = "user.count.error",
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    findAllUsers: builder.query<ResponseEnvelope<User[], UserCodes>, FindAllParams>({
      query: (params) => `users${buildFindAllParams(params)}`,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${JSON.stringify({
          sorting: queryArgs?.sorting,
          search: queryArgs?.search,
          dateFilter: queryArgs?.dateFilter,
        })}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (
          currentCache.status !== enums.ResponseStatus.SUCCESS ||
          newItems.status !== enums.ResponseStatus.SUCCESS
        ) {
          return;
        }

        if (arg.pagination?.page === 1) {
          currentCache.data = newItems.data;
          return;
        } else {
          const existingIds = new Set(currentCache.data.map((i) => i.id));
          const filtered = newItems.data.filter((i) => !existingIds.has(i.id));

          currentCache.data.push(...filtered);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: (result) =>
        result?.status === enums.ResponseStatus.SUCCESS
          ? [
              ...result.data.map(({ id }) => ({ type: "users" as const, id })),
              { type: "users", id: "LIST" },
            ]
          : [{ type: "users", id: "LIST" }],
    }),

    findOneUser: builder.query<ResponseEnvelope<User, UserCodes>, number>({
      query: (id: number) => `users/${id}`,
    }),

    findAllUserRoles: builder.query<ResponseEnvelope<Role[], UserCodes>, number>({
      query: (id: number) => `users/${id}/roles`,
      providesTags: (result) =>
        result?.status === enums.ResponseStatus.SUCCESS
          ? [
              ...result.data.map(({ id }) => ({ type: "users" as const, id })),
              { type: "users", id: "LIST" },
            ]
          : [{ type: "users", id: "LIST" }],
    }),

    createUser: builder.mutation<ResponseEnvelope<User, UserCodes>, CreateUserDto>({
      query: (body) => ({
        url: "auth/registration",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "users", id: "LIST" }],
    }),

    updateUser: builder.mutation<ResponseEnvelope<User, UserCodes>, UpdateUserDto>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `users/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: [{ type: "users", id: "LIST" }],
    }),

    updateRoles: builder.mutation<ResponseEnvelope<Boolean, UserCodes>, UpdateRolesDto>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `users/${id}/roles`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: [{ type: "users", id: "LIST" }],
    }),

    removeUser: builder.mutation<
      ResponseEnvelope<Boolean, UserCodes>,
      { id: number; reason: string }
    >({
      query(data) {
        const { id, reason } = data;
        return {
          url: `users/${id}`,
          method: "DELETE",
          body: { reason },
        };
      },
      invalidatesTags: [{ type: "users", id: "LIST" }],
    }),
  }),
});

export const {
  useFindAllUsersQuery,
  useFindOneUserQuery,
  useLazyFindAllUsersQuery,
  useLazyFindOneUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateRolesMutation,
  useRemoveUserMutation,
} = userApi;

