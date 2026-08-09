import { buildFindAllParams, type FindAllParams } from "../utils";
import { api } from "../api/api";
import { type ResponseEnvelope, enums } from "../../common/response";

export type Permission = {
  readonly id: number;
  readonly value: string;
  readonly description: string;
};

export enum PermissionCodes {
  CREATE_SUCCESS = "permission.create.success",
  CREATE_ERROR = "permission.create.error",

  FIND_ALL_SUCCESS = "permission.findAll.success",
  FIND_ALL_ERROR = "permission.findAll.error",

  FIND_ONE_SUCCESS = "permission.findOne.success",
  FIND_ONE_ERROR = "permission.findOne.error",

  FIND_ONE_OR_THROW_SUCCESS = "permission.findOneOrThrow.success",
  FIND_ONE_OR_THROW_ERROR = "permission.findOneOrThrow.error",

  UPDATE_SUCCESS = "permission.update.success",
  UPDATE_ERROR = "permission.update.error",

  REMOVE_SUCCESS = "permission.remove.success",
  REMOVE_ERROR = "permission.remove.error",

  FORCE_REMOVE_SUCCESS = "permission.forceRemove.success",
  FORCE_REMOVE_ERROR = "permission.forceRemove.error",

  RESTORE_SUCCESS = "permission.restore.success",
  RESTORE_ERROR = "permission.restore.error",

  FIND_ONE_BY_VALUE_SUCCESS = "permission.findOneByValue.success",
  FIND_ONE_BY_VALUE_ERROR = "permission.findOneByValue.error",

  FIND_ALL_BY_ROLE_ID_SUCCESS = "permission.findAllByRoleId.success",
  FIND_ALL_BY_ROLE_ID_ERROR = "permission.findAllByRoleId.error",

  COUNT_SUCCESS = "permission.count.success",
  COUNT_ERROR = "permission.count.error",
}

export const permissionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    findAllPermissions: builder.query<
      ResponseEnvelope<Permission[], PermissionCodes>,
      FindAllParams
    >({
      query: (params) => `permissions${buildFindAllParams(params)}`,
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
              ...result.data.map(({ id }) => ({ type: "permissions" as const, id })),
              { type: "permissions", id: "LIST" },
            ]
          : [{ type: "permissions", id: "LIST" }],
    }),

    findOnePermission: builder.query<ResponseEnvelope<Permission, PermissionCodes>, number>({
      query: (id: number) => `permissions/${id}`,
    }),
  }),
});

export const {
  useFindAllPermissionsQuery,
  useFindOnePermissionQuery,
  useLazyFindAllPermissionsQuery,
  useLazyFindOnePermissionQuery,
} = permissionApi;

