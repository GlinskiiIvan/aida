import { api } from "../api/api";
import { type ResponseEnvelope, enums } from "../../common/response";

interface uploadStudyResponse {
  task_id: string;
  status: string;
}

export enum IngestionCodes {
  INGESTION_STUDY_SUCCESS = "ingestion.ingestionStudy.success",
  INGESTION_STUDY_ERROR = "ingestion.ingestionStudy.error",
  INGESTION_STUDY_ACCEPTED = "ingestion.ingestionStudy.accepted",
  PROCESS_STUDY_SUCCESS = "ingestion.processStudy.success",
  PROCESS_STUDY_ERROR = "ingestion.processStudy.error",
  PROCESS_STUDY_ACCEPTED = "ingestion.processStudy.accepted",
  COMPLETE_STUDY_PROCESSING_SUCCESS = "ingestion.completeStudyProcessing.success",
  COMPLETE_STUDY_PROCESSING_ERROR = "ingestion.completeStudyProcessing.error",
  COMPLETE_STUDY_PROCESSING_ACCEPTED = "ingestion.completeStudyProcessing.accepted",
}

export const ingestionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadStudy: builder.mutation<ResponseEnvelope<uploadStudyResponse, IngestionCodes>, FormData>({
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
