import {buildFindAllParams, type FindAllParams} from "../utils";
import type { ResponseFindAll } from '../interfaces';
import { api } from '../api/api';

export interface CreateRoleDto {
    readonly value: string;
    readonly description?: string;
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {
    id: number;
}

export interface UpdatePermissions {
    id: number;
    permissions: number[];
}

export type Role = {
    id: number,
    value: string,
    description: string,
    permissions: {
        id: number,
        value: string,
    }[]
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
    useFindOneRoleQuery,
    useLazyFindAllRolesQuery,
    useLazyFindOneRoleQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useUpdatePermissionsMutation,
    roleemoveRoleMutation,
} = roleApi; 