import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URI,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem('access_token');

    if (token) {
      headers.set('authorization', `Bearer ${JSON.parse(token)}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const newToken = (refreshResult.data as any).accessToken;

      sessionStorage.setItem('access_token', JSON.stringify(newToken));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};