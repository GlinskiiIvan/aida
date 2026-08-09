import { buildFindAllParams, type FindAllParams } from "../utils";
import type { Status } from "../../common/enums";
import { api } from "../api/api";
import type { PredictionBase } from "./prediction";
import { type ResponseEnvelope, enums } from "../../common/response";

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
};

export enum PredictionRunCodes {
  CREATE_SUCCESS = "prediction_run.create.success",
  CREATE_ERROR = "prediction_run.create.error",

  FIND_ALL_SUCCESS = "prediction_run.findAll.success",
  FIND_ALL_ERROR = "prediction_run.findAll.error",

  FIND_ONE_SUCCESS = "prediction_run.findOne.success",
  FIND_ONE_ERROR = "prediction_run.findOne.error",

  FIND_ONE_OR_THROW_SUCCESS = "prediction_run.findOneOrThrow.success",
  FIND_ONE_OR_THROW_ERROR = "prediction_run.findOneOrThrow.error",

  UPDATE_SUCCESS = "prediction_run.update.success",
  UPDATE_ERROR = "prediction_run.update.error",

  REMOVE_SUCCESS = "prediction_run.remove.success",
  REMOVE_ERROR = "prediction_run.remove.error",

  FORCE_REMOVE_SUCCESS = "prediction_run.forceRemove.success",
  FORCE_REMOVE_ERROR = "prediction_run.forceRemove.error",

  RESTORE_SUCCESS = "prediction_run.restore.success",
  RESTORE_ERROR = "prediction_run.restore.error",

  FIND_ALL_BY_STUDY_ID_SUCCESS = "prediction_run.findAllByStudyId.success",
  FIND_ALL_BY_STUDY_ID_ERROR = "prediction_run.findAllByStudyId.error",

  FIND_ALL_BY_USER_ID_SUCCESS = "prediction_run.findAllByUserId.success",
  FIND_ALL_BY_USER_ID_ERROR = "prediction_run.findAllByUseerId.error",

  FIND_ALL_PREDICTIONS_SUCCESS = "prediction_run.findAllPredictions.success",
  FIND_ALL_PREDICTIONS_ERROR = "prediction_run.findAllPredictions.error",
}

export const predictionRunApi = api.injectEndpoints({
  endpoints: (builder) => ({
    findAllPredictionsByRun: builder.query<
      ResponseEnvelope<PredictionBase[], PredictionRunCodes>,
      FindAllParams & { runId: number }
    >({
      query: ({ runId, ...body }) =>
        `prediction-run/${runId}/predictions${buildFindAllParams(body)}`,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${JSON.stringify({
          rundId: queryArgs.runId,
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
              ...result.data.map(({ id }) => ({ type: "prediction-runs" as const, id })),
              { type: "prediction-runs", id: "LIST" },
            ]
          : [{ type: "prediction-runs", id: "LIST" }],
    }),
  }),
});

export const { useFindAllPredictionsByRunQuery, useLazyFindAllPredictionsByRunQuery } =
  predictionRunApi;
