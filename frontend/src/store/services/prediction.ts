import {buildFindAllParams, type FindAllParams} from "../utils";
import type { ResponseFindAll } from '../interfaces';
import type { Modality, Orientation, Protocol, ResultClass, Status } from '../../common/enums';
import { api } from '../api/api';

export type PredictionBase = {
    id: number;
    runId: number;
    imageId: number;
    status: Status;
    resultClass?: ResultClass | null;
    maxConfidence?: number | null;
    minConfidence?: number | null;
    executionTime?: number | null;
    rawOutput?: Record<string, unknown>[] | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export const predictionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        
    }),
});

export const {
} = predictionApi;