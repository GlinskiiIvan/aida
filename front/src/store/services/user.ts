import {buildFindAllParams, type FindAllParams} from "../utils";
import type { ResponseFindAll } from '../interfaces';
import { api } from '../api/api';

export interface CreateUserDto {
    readonly email: string;
    readonly password: string
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
    id: number;
}

export type User = {
    id: number,
    email: string,
    password: string,
    banned: boolean,
    banReason: string,
    refreshToken: string,
    deletedAt: string, 
}

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        findAllUsers: builder.query<ResponseFindAll<User[]>, FindAllParams>({
            query: (params) => `users${buildFindAllParams(params)}`,
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
                        ...result.data.map(({ id }) => ({ type: 'users' as const, id })),
                        { type: 'users', id: 'LIST' },
                    ]
                    : [{ type: 'users', id: 'LIST' }],
        }),

        findOneUser: builder.query<User, number>({
            query: (id: number) => `users/${id}`,
        }),

        createUser: builder.mutation<User, CreateUserDto>({
            query: (body) => ({
                url: 'auth/registration',
                method: 'POST',
                body
            }),
            invalidatesTags: [{type: 'users', id: 'LIST'}],
        }),

        updateUser: builder.mutation<User, UpdateUserDto>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `users/${id}`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: [{type: 'users', id: 'LIST'}],
        }),

        removeUser: builder.mutation<boolean, {id: number, reason: string}>({
            query(data) {
                const { id, reason } = data;
                return {
                    url: `users/${id}`,
                    method: 'DELETE',
                    body: {reason},
                }
            },
            invalidatesTags: [{type: 'users', id: 'LIST'}],
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
    useRemoveUserMutation,
} = userApi; 