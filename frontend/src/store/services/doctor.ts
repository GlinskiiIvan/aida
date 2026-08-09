import { buildFindAllParams, type FindAllParams } from "../utils";
import { api } from "../api/api";
import { type ResponseEnvelope, enums } from "../../common/response";

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
};

export enum DoctorCodes {
  CREATE_SUCCESS = "doctor.create.success",
  CREATE_ERROR = "doctor.create.error",

  FIND_ALL_SUCCESS = "doctor.findAll.success",
  FIND_ALL_ERROR = "doctor.findAll.error",

  FIND_ONE_SUCCESS = "doctor.findOne.success",
  FIND_ONE_ERROR = "doctor.findOne.error",

  FIND_ONE_OR_THROW_SUCCESS = "doctor.findOneOrThrow.success",
  FIND_ONE_OR_THROW_ERROR = "doctor.findOneOrThrow.error",

  UPDATE_SUCCESS = "doctor.update.success",
  UPDATE_ERROR = "doctor.update.error",

  REMOVE_SUCCESS = "doctor.remove.success",
  REMOVE_ERROR = "doctor.remove.error",

  FORCE_REMOVE_SUCCESS = "doctor.forceRemove.success",
  FORCE_REMOVE_ERROR = "doctor.forceRemove.error",

  RESTORE_SUCCESS = "doctor.restore.success",
  RESTORE_ERROR = "doctor.restore.error",

  FIND_ONE_OR_THROW_BY_USER_ID_SUCCESS = "doctor.findOneOrThrowByUserId.success",
  FIND_ONE_OR_THROW_BY_USER_ID_ERROR = "doctor.findOneOrThrowByUserId.error",

  FIND_ALL_PATIENTS_SUCCESS = "doctor.findAllPatients.success",
  FIND_ALL_PATIENTS_ERROR = "doctor.findAllPatients.error",
}

export const doctorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    findAllDoctors: builder.query<ResponseEnvelope<Doctor[], DoctorCodes>, FindAllParams>({
      query: (params) => `doctors${buildFindAllParams(params)}`,
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
                type: "doctors" as const,
                id,
              })),
              {
                type: "doctors",
                id: "LIST",
              },
            ]
          : [
              {
                type: "doctors",
                id: "LIST",
              },
            ],
    }),

    findOneDoctor: builder.query<ResponseEnvelope<Doctor, DoctorCodes>, number>({
      query: (id: number) => `doctors/${id}`,
    }),

    createDoctor: builder.mutation<ResponseEnvelope<Doctor, DoctorCodes>, CreateDoctorDto>({
      query: (body) => ({
        url: "doctors",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "doctors", id: "LIST" }],
    }),

    updateDoctor: builder.mutation<ResponseEnvelope<Doctor, DoctorCodes>, UpdateDoctorDto>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `doctors/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: [{ type: "doctors", id: "LIST" }],
    }),

    removeDoctor: builder.mutation<
      ResponseEnvelope<Boolean, DoctorCodes>,
      { id: number; reason: string }
    >({
      query(data) {
        const { id, reason } = data;
        return {
          url: `doctors/${id}`,
          method: "DELETE",
          body: { reason },
        };
      },
      invalidatesTags: [{ type: "doctors", id: "LIST" }],
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
