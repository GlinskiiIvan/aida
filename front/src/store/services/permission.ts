import {buildFindAllParams, type FindAllParams} from "../utils";
import type { ResponseFindAll } from '../interfaces';
import { api } from '../api/api';

export type Permission = {
    readonly id: number,
    readonly value: string,
    readonly description: string,
}

export const permissionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        findAllPermissions: builder.query<ResponseFindAll<Permission[]>, FindAllParams>({
            query: (params) => `permissions${buildFindAllParams(params)}`,
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
                        ...result.data.map(({ id }) => ({ type: 'permissions' as const, id })),
                        { type: 'permissions', id: 'LIST' },
                    ]
                    : [{ type: 'permissions', id: 'LIST' }],
        }),

        findOnePermission: builder.query<Permission, number>({
            query: (id: number) => `permissions/${id}`,
        }),
    })
});

export const {
    useFindAllPermissionsQuery,
    useFindOnePermissionQuery,
    useLazyFindAllPermissionsQuery,
    useLazyFindOnePermissionQuery,
} = permissionApi; 