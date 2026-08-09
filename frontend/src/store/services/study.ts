import { buildFindAllParams, type FindAllParams } from "../utils";
import type { Modality, Orientation, Protocol, Status } from "../../common/enums";
import { api } from "../api/api";
import type { PredictionRun } from "./predictionRun";
import { type ResponseEnvelope, enums } from "../../common/response";

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
};

export interface UpdateStudyDto extends Partial<
  Omit<Study, "id" | "patientId" | "status" | "path" | "createdAt" | "updatedAt" | "deletedAt">
> {
  id: number;
  reason?: string;
}

export type InstanceImage = {
  id: number;
  seriesId: string;
  imageName: string;
  imagePath: string;
  instanceNumber: number;
  rawMetadata: JSON;
  series: {
    id: string;
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
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export enum StudyCodes {
  CREATE_SUCCESS = "study.create.success",
  CREATE_ERROR = "study.create.error",

  FIND_ALL_SUCCESS = "study.findAll.success",
  FIND_ALL_ERROR = "study.findAll.error",

  FIND_ONE_SUCCESS = "study.findOne.success",
  FIND_ONE_ERROR = "study.findOne.error",

  FIND_ONE_OR_THROW_SUCCESS = "study.findOneOrThrow.success",
  FIND_ONE_OR_THROW_ERROR = "study.findOneOrThrow.error",

  UPDATE_SUCCESS = "study.update.success",
  UPDATE_ERROR = "study.update.error",

  REMOVE_SUCCESS = "study.remove.success",
  REMOVE_ERROR = "study.remove.error",

  FORCE_REMOVE_SUCCESS = "study.forceRemove.success",
  FORCE_REMOVE_ERROR = "study.forceRemove.error",

  RESTORE_SUCCESS = "study.restore.success",
  RESTORE_ERROR = "study.restore.error",

  FIND_ALL_BY_PATIENT_ID_SUCCESS = "study.findAllByPatientId.success",
  FIND_ALL_BY_PATIENT_ID_ERROR = "study.findAllByPatientId.error",

  FIND_ALL_SERIES_SUCCESS = "study.findAllSeries.success",
  FIND_ALL_SERIES_ERROR = "study.findAllSeries.error",

  FIND_ALL_RUNS_SUCCESS = "study.findAllRuns.success",
  FIND_ALL_RUNS_ERROR = "study.findAllRuns.error",

  FIND_ALL_IMAGES_SUCCESS = "study.findAllImages.success",
  FIND_ALL_IMAGES_ERROR = "study.findAllImages.error",
}

export const studyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    findAllStudies: builder.query<ResponseEnvelope<Study[], StudyCodes>, FindAllParams>({
      query: (body) => `study${buildFindAllParams(body)}`,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${JSON.stringify({
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
              ...result.data.map(({ id }) => ({ type: "studies" as const, id })),
              { type: "studies", id: "LIST" },
              { type: "ingestion", id: "LIST" },
            ]
          : [
              { type: "studies", id: "LIST" },
              { type: "ingestion", id: "LIST" },
            ],
    }),

    findAllStudyRuns: builder.query<
      ResponseEnvelope<PredictionRun[], StudyCodes>,
      FindAllParams & { id: number }
    >({
      query: ({ id, ...body }) => `study/${id}/runs${buildFindAllParams(body)}`,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${JSON.stringify({
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
              ...result.data.map(({ id }) => ({ type: "studies" as const, id })),
              { type: "studies", id: "LIST" },
              { type: "inference", id: "LIST" },
            ]
          : [
              { type: "studies", id: "LIST" },
              { type: "inference", id: "LIST" },
            ],
    }),

    findAllStudyImages: builder.query<
      ResponseEnvelope<InstanceImage[]>,
      FindAllParams & { id: number }
    >({
      query: ({ id, ...body }) => `study/${id}/images${buildFindAllParams(body)}`,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${JSON.stringify({
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
              ...result.data.map(({ id }) => ({ type: "studies" as const, id })),
              { type: "studies", id: "LIST" },
              { type: "ingestion", id: "LIST" },
            ]
          : [
              { type: "studies", id: "LIST" },
              { type: "ingestion", id: "LIST" },
            ],
    }),

    findOneStudy: builder.query<ResponseEnvelope<Study, StudyCodes>, number>({
      query: (id: number) => `study/${id}`,
    }),

    updateStudy: builder.mutation<ResponseEnvelope<Study, StudyCodes>, UpdateStudyDto>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `study/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: [{ type: "studies", id: "LIST" }],
    }),

    removeStudy: builder.mutation<
      ResponseEnvelope<Boolean, StudyCodes>,
      { id: number; reason: string }
    >({
      query(data) {
        const { id, reason } = data;
        return {
          url: `study/${id}`,
          method: "DELETE",
          body: { reason },
        };
      },
      invalidatesTags: [{ type: "studies", id: "LIST" }],
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
