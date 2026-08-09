import { buildFindAllParams, type FindAllParams } from "../utils";
import type { Gender } from "../../common/enums";
import type { Study } from "./study";
import { api } from "../api/api";
import { type ResponseEnvelope, enums } from "../../common/response";

export interface CreatePatientDto {
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
  id: number;
  isPublic: boolean;
  fullName: string;
  birthDate: string;
  gender: Gender;
  phone: string;
  email: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export enum PatientCodes {
  CREATE_SUCCESS = "patient.create.success",
  CREATE_ERROR = "patient.create.error",

  FIND_ALL_SUCCESS = "patient.findAll.success",
  FIND_ALL_ERROR = "patient.findAll.error",

  FIND_ALL_BY_DOCTOR_ID_SUCCESS = "patient.findAllByDoctorId.success",
  FIND_ALL_BY_DOCTOR_ID_ERROR = "patient.findAllByDoctorId.error",

  FIND_ONE_SUCCESS = "patient.findOne.success",
  FIND_ONE_ERROR = "patient.findOne.error",

  FIND_ONE_OR_THROW_SUCCESS = "patient.findOneOrThrow.success",
  FIND_ONE_OR_THROW_ERROR = "patient.findOneOrThrow.error",

  UPDATE_SUCCESS = "patient.update.success",
  UPDATE_ERROR = "patient.update.error",

  REMOVE_SUCCESS = "patient.remove.success",
  REMOVE_ERROR = "patient.remove.error",

  FORCE_REMOVE_SUCCESS = "patient.forceRemove.success",
  FORCE_REMOVE_ERROR = "patient.forceRemove.error",

  RESTORE_SUCCESS = "patient.restore.success",
  RESTORE_ERROR = "patient.restore.error",

  FIND_ALL_STUDIES_SUCCESS = "patient.findAllStudies.success",
  FIND_ALL_STUDIES_ERROR = "patient.findAllStudies.error",
}

export const patientApi = api.injectEndpoints({
  endpoints: (builder) => ({
    findAllPatients: builder.query<ResponseEnvelope<Patient[], PatientCodes>, FindAllParams>({
      query: (params) => `patients${buildFindAllParams(params)}`,
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
              ...result.data.map(({ id }) => ({
                type: "patients" as const,
                id,
              })),
              {
                type: "patients",
                id: "LIST",
              },
            ]
          : [
              {
                type: "patients",
                id: "LIST",
              },
            ],
    }),

    findAllPatientStudies: builder.query<
      ResponseEnvelope<Study[], PatientCodes>,
      FindAllParams & { id: number }
    >({
      query: ({ id, ...params }) => `patients/${id}/studies${buildFindAllParams(params)}`,
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
              ...result.data.map(({ id }) => ({ type: "patients" as const, id })),
              { type: "patients", id: "LIST" },
              { type: "ingestion", id: "LIST" },
            ]
          : [
              { type: "patients", id: "LIST" },
              { type: "ingestion", id: "LIST" },
            ],
    }),

    findOnePatient: builder.query<ResponseEnvelope<Patient>, number>({
      query: (id: number) => `patients/${id}`,
    }),

    createPatient: builder.mutation<ResponseEnvelope<Patient>, CreatePatientDto>({
      query: (body) => ({
        url: "patients",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "patients", id: "LIST" }],
    }),

    updatePatient: builder.mutation<ResponseEnvelope<Patient>, UpdatePatientDto>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `patients/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: [{ type: "patients", id: "LIST" }],
    }),

    removePatient: builder.mutation<ResponseEnvelope<Boolean>, { id: number; reason: string }>({
      query(data) {
        const { id, reason } = data;
        return {
          url: `patients/${id}`,
          method: "DELETE",
          body: { reason },
        };
      },
      invalidatesTags: [{ type: "patients", id: "LIST" }],
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
