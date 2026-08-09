import { api } from "../api/api";
import { type ResponseEnvelope, enums } from "../../common/response";

export type PredictionRunDto = {
  readonly model: string;
  readonly version: string;
};

interface PredictionResponse {
  taskId: string;
  status: string;
}

export enum InferenceCodes {
  PREDICT_SUCCESS = "inference.predict.success",
  PREDICT_ERROR = "inference.predict.error",
  PREDICT_ACCEPTED = "inference.predict.accepted",

  COMPLETE_INFERENCE_PROCESSING_SUCCESS = "inference.completeInferenceProcessing.success",
  COMPLETE_INFERENCE_PROCESSING_ERROR = "inference.completeInferenceProcessing.error",
  COMPLETE_INFERENCE_PROCESSING_ACCEPTED = "inference.completeInferenceProcessing.accepted",
}

export const inferenceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    predict: builder.mutation<
      ResponseEnvelope<PredictionResponse, InferenceCodes>,
      PredictionRunDto & { studyId: string }
    >({
      query: ({ studyId, ...body }) => ({
        url: `inference/predict/${studyId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "inference", id: "LIST" }],
    }),
  }),
});

export const { usePredictMutation } = inferenceApi;
