import {buildFindAllParams, type FindAllParams} from "../utils";
import type { ResponseFindAll } from '../interfaces';
import { api } from '../api/api';

export interface CreateDoctorDto {
    readonly userId: number;
    readonly fullName: string;
    readonly birthDate: Date;
    readonly gender: string;
    readonly phone: string;
    readonly contactEmail?: string | null;
    readonly specialization: string;
    readonly department: string;
    readonly licenseNumber?: string | null;
    readonly note?: string | null;
}

export interface UpdateDoctorDto extends Partial<CreateDoctorDto> {
    readonly id: number;
}

export type Doctor = {
    readonly id: number;
    readonly userId: number;
    readonly user: {
        id: number;
        email: string;
    };
    readonly fullName: string;
    readonly birthDate: string;
    readonly gender: string;
    readonly phone: string;
    readonly contactEmail?: string | null;
    readonly specialization: string;
    readonly department: string;
    readonly licenseNumber?: string | null;
    readonly note?: string | null;
}

export const doctorApi = api.injectEndpoints({
    endpoints: (builder) => ({
        findAllDoctors: builder.query<ResponseFindAll<Doctor[]>, FindAllParams>({
            query: (params) => `doctors${buildFindAllParams(params)}`,
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
                        ...result.data.map(({ id }) => ({ type: 'doctors' as const, id })),
                        { type: 'doctors', id: 'LIST' },
                    ]
                    : [{ type: 'doctors', id: 'LIST' }],
        }),

        findOneDoctor: builder.query<Doctor, number>({
            query: (id: number) => `doctors/${id}`,
        }),

        createDoctor: builder.mutation<Doctor, CreateDoctorDto>({
            query: (body) => ({
                url: 'doctors',
                method: 'POST',
                body
            }),
            invalidatesTags: [{type: 'doctors', id: 'LIST'}],
        }),

        updateDoctor: builder.mutation<Doctor, UpdateDoctorDto>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `doctors/${id}`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: [{type: 'doctors', id: 'LIST'}],
        }),

        removeDoctor: builder.mutation<boolean, {id: number, reason: string}>({
            query(data) {
                const { id, reason } = data;
                return {
                    url: `doctors/${id}`,
                    method: 'DELETE',
                    body: {reason},
                }
            },
            invalidatesTags: [{type: 'doctors', id: 'LIST'}],
        }),
    }),
});

export const {
    useFindAllDoctorsQuery,
    useFindOneDoctorQuery,
    useLazyFindAllDoctorsQuery,
    useLazyFindOneDoctorQuery,
    useCreateDoctorMutation,
    useUpdateDoctorMutation,
    useRemoveDoctorMutation,
} = doctorApi; 