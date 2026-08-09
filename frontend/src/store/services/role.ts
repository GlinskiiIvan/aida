import { buildFindAllParams, type FindAllParams } from "../utils";
import { api } from "../api/api";
import type { Permission } from "./permission";
import { type ResponseEnvelope, enums } from "../../common/response";

export interface CreateRoleDto {
  readonly value: string;
  readonly description?: string;
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {
  readonly id: number;
}

export interface UpdatePermissions {
  readonly id: number;
  readonly permissions: number[];
}

export type Role = {
  readonly id: number;
  readonly value: string;
  readonly description: string;
};

export enum RoleCodes {
  CREATE_SUCCESS = "role.create.success",
  CREATE_ERROR = "role.create.error",

  FIND_ALL_SUCCESS = "role.findAll.success",
  FIND_ALL_ERROR = "role.findAll.error",

  FIND_ONE_SUCCESS = "role.findOne.success",
  FIND_ONE_ERROR = "role.findOne.error",

  FIND_ONE_OR_THROW_SUCCESS = "role.findOneOrThrow.success",
  FIND_ONE_OR_THROW_ERROR = "role.findOneOrThrow.error",

  UPDATE_SUCCESS = "role.update.success",
  UPDATE_ERROR = "role.update.error",

  REMOVE_SUCCESS = "role.remove.success",
  REMOVE_ERROR = "role.remove.error",

  FORCE_REMOVE_SUCCESS = "role.forceRemove.success",
  FORCE_REMOVE_ERROR = "role.forceRemove.error",

  RESTORE_SUCCESS = "role.restore.success",
  RESTORE_ERROR = "role.restore.error",

  FIND_ALL_PERMISSIONS_SUCCESS = "role.findAllPermissions.success",
  FIND_ALL_PERMISSIONS_ERROR = "role.findAllPermissions.error",

  FIND_ONE_BY_VALUE_SUCCESS = "role.findOneByValue.success",
  FIND_ONE_BY_VALUE_ERROR = "role.findOneByValue.error",

  FIND_ALL_USERS_SUCCESS = "role.findAllUsers.success",
  FIND_ALL_USERS_ERROR = "role.findAllUsers.error",

  FIND_ALL_BY_USER_ID_SUCCESS = "role.findAllByUserId.success",
  FIND_ALL_BY_USER_ID_ERROR = "role.findAllByUserId.error",

  UPDATE_PERMISSIONS_SUCCESS = "role.updatePermissions.success",
  UPDATE_PERMISSIONS_ERROR = "role.updatePermissions.error",

  COUNT_SUCCESS = "role.count.success",
  COUNT_ERROR = "role.count.error",
}

export const roleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    findAllRoles: builder.query<ResponseEnvelope<Role[], RoleCodes>, FindAllParams>({
      query: (params) => `roles${buildFindAllParams(params)}`,
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
              ...result.data.map(({ id }) => ({ type: "roles" as const, id })),
              { type: "roles", id: "LIST" },
            ]
          : [{ type: "roles", id: "LIST" }],
    }),

    findAllRolePermissions: builder.query<ResponseEnvelope<Permission[], RoleCodes>, number>({
      query: (id: number) => `roles/${id}/permissions`,
      providesTags: (result) =>
        result?.status === enums.ResponseStatus.SUCCESS
          ? [
              ...result.data.map(({ id }) => ({ type: "roles" as const, id })),
              { type: "roles", id: "LIST" },
            ]
          : [{ type: "roles", id: "LIST" }],
    }),

    findOneRole: builder.query<ResponseEnvelope<Role, RoleCodes>, number>({
      query: (id: number) => `roles/${id}`,
    }),

    createRole: builder.mutation<ResponseEnvelope<Role, RoleCodes>, CreateRoleDto>({
      query: (body) => ({
        url: "roles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "roles", id: "LIST" }],
    }),

    updateRole: builder.mutation<ResponseEnvelope<Role, RoleCodes>, UpdateRoleDto>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `roles/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: [{ type: "roles", id: "LIST" }],
    }),

    updatePermissions: builder.mutation<ResponseEnvelope<Boolean, RoleCodes>, UpdatePermissions>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `roles/${id}/permissions`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: [{ type: "roles", id: "LIST" }],
    }),

    removeRole: builder.mutation<
      ResponseEnvelope<Boolean, RoleCodes>,
      { id: number; reason: string }
    >({
      query(data) {
        const { id, reason } = data;
        return {
          url: `roles/${id}`,
          method: "DELETE",
          body: { reason },
        };
      },
      invalidatesTags: [{ type: "roles", id: "LIST" }],
    }),
  }),
});

export const {
  useFindAllRolesQuery,
  useFindAllRolePermissionsQuery,
  useFindOneRoleQuery,
  useLazyFindAllRolesQuery,
  useLazyFindOneRoleQuery,
  useLazyFindAllRolePermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useUpdatePermissionsMutation,
  useRemoveRoleMutation,
} = roleApi;

