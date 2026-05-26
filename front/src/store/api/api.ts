import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['users', 'studies', 'ingestion', 'inference', 'predictionRun', 'prediction', 'users'],
  endpoints: () => ({}),
});