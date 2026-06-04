import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'inference',
    'ingestion',
    'patients',
    'permissions',
    'predictions',
    'prediction-runs',
    'roles',
    'studies',
    'users',
  ],
  endpoints: () => ({}),
});