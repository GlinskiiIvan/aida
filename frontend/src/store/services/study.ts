import {buildFindAllParams, type FindAllParams} from "../utils";
import type { ResponseFindAll } from '../interfaces';
import type { Modality, Orientation, Protocol, Status } from '../../common/enums';
import { api } from '../api/api';
import type { PredictionRun } from "./predictionRun";

export type Study = {
    id: number;
    patientId: number;
    studyInstanceUID: string | null;
    studyId: string | null;
    specificCharacterSet: string | null;
    studyDateTime: Date | null;
    modality: Modality | null;
    description: string | null;
    institutionName: string | null;
    manufacturer: string | null;
    manufacturersModelName: string | null;
    stationName: string | null;
    referringPhysiciansName: string | null;
    status: Status;
    path: string | null;
    seriesCount: number | null;
    imagesCount: number | null;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface UpdateStudyDto extends Partial<Omit<Study, 'id' | 'patientId' | 'status' | 'path' | 'createdAt' | 'updatedAt' | 'deletedAt'>> {
    id: number;
    reason?: string;
}

export type InstanceImage = {
    id: number;
    seriesId: number;
    imageName: string;
    imagePath: string;
    instanceNumber: number;
    rawMetadata: JSON;
    series: {
        id: number;
        studyId: number;
        seriesNumber?: string | null;
        modality?: Modality | null;
        protocol?: Protocol | null;
        orientation?: Orientation | null;
        imagesCount?: number | null;
        rawMetadata?: JSON | null;
        path: string;
        status: Status;
        description?: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export const studyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        findAllStudies: builder.query<ResponseFindAll<Study[]>, FindAllParams>({
            query: (body) => `study${buildFindAllParams(body)}`,
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
                        ...result.data.map(({ id }) => ({ type: 'studies' as const, id })),
                        { type: 'studies', id: 'LIST' },
                    ]
                    : [{ type: 'studies', id: 'LIST' }],
        }),

        findAllStudyRuns: builder.query<ResponseFindAll<PredictionRun[]>, FindAllParams & {id: number}>({
            query: ({id, ...body}) => `study/${id}/runs${buildFindAllParams(body)}`,
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
                        ...result.data.map(({ id }) => ({ type: 'studies' as const, id })),
                        { type: 'studies', id: 'LIST' },
                    ]
                    : [{ type: 'studies', id: 'LIST' }],
        }),

        findAllStudyImages: builder.query<ResponseFindAll<InstanceImage[]>, FindAllParams & {id: number}>({
            query: ({id, ...body}) => `study/${id}/images${buildFindAllParams(body)}`,
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
                        ...result.data.map(({ id }) => ({ type: 'studies' as const, id })),
                        { type: 'studies', id: 'LIST' },
                    ]
                    : [{ type: 'studies', id: 'LIST' }],
        }),

        findOneStudy: builder.query<Study, number>({
            query: (id: number) => `study/${id}`,
        }),

        updateStudy: builder.mutation<Study, UpdateStudyDto>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `study/${id}`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: [{type: 'studies', id: 'LIST'}],
        }),

        removeStudy: builder.mutation<boolean, {id: number, reason: string}>({
            query(data) {
                const { id, reason } = data;
                return {
                    url: `study/${id}`,
                    method: 'DELETE',
                    body: {reason},
                }
            },
            invalidatesTags: [{type: 'studies', id: 'LIST'}],
        }),
    }),
});

export const {
    useFindAllStudiesQuery,
    useFindOneStudyQuery,
    useFindAllStudyRunsQuery,
    useFindAllStudyImagesQuery,
    useLazyFindAllStudiesQuery,
    useLazyFindOneStudyQuery,
    useLazyFindAllStudyRunsQuery,
    useLazyFindAllStudyImagesQuery,
    useUpdateStudyMutation,
    useRemoveStudyMutation,
} = studyApi;