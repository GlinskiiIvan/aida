import {buildFindAllParams, type FindAllParams} from "../utils";
import type { ResponseFindAll } from '../interfaces';
import type { Status } from '../../common/enums';
import { api } from '../api/api';
import type { PredictionBase } from "./prediction";

export type PredictionRun = {
    id: number;
    studyId: number;
    createdById: number;
    model: string;
    version: string;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export const predictionRunApi = api.injectEndpoints({
    endpoints: (builder) => ({
        findAllPredictionsByRun: builder.query<ResponseFindAll<PredictionBase[]>, FindAllParams & {runId: number}>({
            query: ({runId, ...body}) => `prediction-run/${runId}/predictions${buildFindAllParams(body)}`,
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${JSON.stringify({
                    rundId: queryArgs.runId,
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
                        ...result.data.map(({ id }) => ({ type: 'predictionRun' as const, id })),
                        { type: 'predictionRun', id: 'LIST' },
                    ]
                    : [{ type: 'predictionRun', id: 'LIST' }],
        }),
    }),
});

export const {
    useFindAllPredictionsByRunQuery,
    useLazyFindAllPredictionsByRunQuery,
} = predictionRunApi;