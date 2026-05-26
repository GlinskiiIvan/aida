import { api } from '../api/api';

export type PredictionRunDto = {
    readonly model: string;
    readonly version: string;
}

export const inferenceApi = api.injectEndpoints({
    endpoints: (builder) => ({
        predict: builder.mutation<Boolean, PredictionRunDto & {studyId: number}>({
            query: ({studyId, ...body}) => ({
                url: `inference/predict/${studyId}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'inference', id: 'LIST'}],
        }),
    }),
});

export const {
    usePredictMutation,
} = inferenceApi;