import {buildFindAllParams, type FindAllParams} from "../utils";
import type { Gender } from '../../common/enums';
import type { ResponseFindAll } from '../interfaces';
import type { Study } from './study';
import { api } from '../api/api';

export interface CreatePatientDto {
    readonly doctorId: number;
    readonly fullName: string;
    readonly birthDate: string;
    readonly gender: Gender;
    readonly phone: string;
    readonly email?: string;
    readonly note?: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {
    id: number;
    reason?: string;
}

export type Patient = {
    id: number,
    doctorId: number,
    isPublic: boolean,
    fullName: string,
    birthDate: string,
    gender: Gender,
    phone: string,
    email: string | null,
    note: string | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
}

export const patientApi = api.injectEndpoints({
    endpoints: (builder) => ({
        findAllPatients: builder.query<ResponseFindAll<Patient[]>, FindAllParams>({
            query: (params) => `patients${buildFindAllParams(params)}`,
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
                        ...result.data.map(({ id }) => ({ type: 'patients' as const, id })),
                        { type: 'patients', id: 'LIST' },
                    ]
                    : [{ type: 'patients', id: 'LIST' }],
        }),

        findAllPatientStudies: builder.query<ResponseFindAll<Study[]>, FindAllParams & {id: number}>({
            query: ({id, ...params}) => `patients/${id}/studies${buildFindAllParams(params)}`,
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
                        ...result.data.map(({ id }) => ({ type: 'patients' as const, id })),
                        { type: 'patients', id: 'LIST' },
                    ]
                    : [{ type: 'patients', id: 'LIST' }],
        }),

        findOnePatient: builder.query<Patient, number>({
            query: (id: number) => `patients/${id}`,
        }),

        createPatient: builder.mutation<Patient, CreatePatientDto>({
            query: (body) => ({
                url: 'patients',
                method: 'POST',
                body
            }),
            invalidatesTags: [{type: 'patients', id: 'LIST'}],
        }),

        updatePatient: builder.mutation<Patient, UpdatePatientDto>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `patients/${id}`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: [{type: 'patients', id: 'LIST'}],
        }),

        removePatient: builder.mutation<boolean, {id: number, reason: string}>({
            query(data) {
                const { id, reason } = data;
                return {
                    url: `patients/${id}`,
                    method: 'DELETE',
                    body: {reason},
                }
            },
            invalidatesTags: [{type: 'patients', id: 'LIST'}],
        }),
    }),
});

export const {
    useFindAllPatientsQuery,
    useFindAllPatientStudiesQuery,
    useFindOnePatientQuery,
    useLazyFindAllPatientsQuery,
    useLazyFindAllPatientStudiesQuery,
    useLazyFindOnePatientQuery,
    useCreatePatientMutation,
    useUpdatePatientMutation,
    useRemovePatientMutation,
} = patientApi; 