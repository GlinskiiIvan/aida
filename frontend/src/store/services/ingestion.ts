import { api } from "../api/api";

interface uploadStudyResponse {
  task_id: string;
  status: string;
}

export const ingestionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadStudy: builder.mutation<uploadStudyResponse, FormData>({
      query: (body) => ({
        url: "ingestion/upload/study",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ingestion", id: "LIST" }],
    }),
  }),
});

export const { useUploadStudyMutation } = ingestionApi;
