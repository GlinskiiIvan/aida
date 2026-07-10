import { api } from '../api/api';

export const ingestionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        uploadStudy: builder.mutation<Boolean, FormData>({
            query: (body) => ({
                url: 'ingestion/upload/study',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'ingestion', id: 'LIST'}],
        }),
    }),
});

export const {
    useUploadStudyMutation,
} = ingestionApi;