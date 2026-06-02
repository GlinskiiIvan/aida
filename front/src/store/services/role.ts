import {buildFindAllParams, type FindAllParams} from "../utils";
import type { ResponseFindAll } from '../interfaces';
import { api } from '../api/api';
import type { Permission } from "./permission";

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
    readonly id: number,
    readonly value: string,
    readonly description: string,
}

export const roleApi = api.injectEndpoints({
    endpoints: (builder) => ({
        findAllRoles: builder.query<ResponseFindAll<Role[]>, FindAllParams>({
            query: (params) => `roles${buildFindAllParams(params)}`,
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${JSON.stringify({
                    sorting: queryArgs?.sorting,
                    search: queryArgs?.search,
                    dateFilter: queryArgs?.dateFilter
                })}`;
            },
            merge: (currentCache, newItems, {arg}) => {
                if(arg.pagination?.page === 1) {
                    currentCache.data = newItems.data;
                    return;
                } else {
                    const existingIds = new Set(currentCache.data.map(i => i.id));
                    const filtered = newItems.data.filter(i => !existingIds.has(i.id));

                    currentCache.data.push(...filtered);
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'roles' as const, id })),
                        { type: 'roles', id: 'LIST' },
                    ]
                    : [{ type: 'roles', id: 'LIST' }],
        }),

        findAllRolePermissions: builder.query<Permission[], number>({
            query: (id: number) => `roles/${id}/permissions`,
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (newItems) => {
                return newItems;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'roles' as const, id })),
                        { type: 'roles', id: 'LIST' },
                    ]
                    : [{ type: 'roles', id: 'LIST' }],
        }),

        findOneRole: builder.query<Role, number>({
            query: (id: number) => `roles/${id}`,
        }),

        createRole: builder.mutation<Role, CreateRoleDto>({
            query: (body) => ({
                url: 'roles',
                method: 'POST',
                body
            }),
            invalidatesTags: [{type: 'roles', id: 'LIST'}],
        }),

        updateRole: builder.mutation<Role, UpdateRoleDto>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `roles/${id}`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: [{type: 'roles', id: 'LIST'}],
        }),

        updatePermissions: builder.mutation<Boolean, UpdatePermissions>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `roles/${id}/permissions`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: [{type: 'roles', id: 'LIST'}],
        }),

        removeRole: builder.mutation<boolean, {id: number, reason: string}>({
            query(data) {
                const { id, reason } = data;
                return {
                    url: `roles/${id}`,
                    method: 'DELETE',
                    body: {reason},
                }
            },
            invalidatesTags: [{type: 'roles', id: 'LIST'}],
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