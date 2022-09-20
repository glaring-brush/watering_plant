import { selectToken } from '../selectors';
import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

export const defaultAuthHeaders = (headers, { getState }) => {
  const token = selectToken(getState());

  if (token) {
    headers.set('Authorization', `${token}`);
  }

  return headers;
};

export const baseQuery = fetchBaseQuery({
  baseUrl: '',
  prepareHeaders: defaultAuthHeaders,
});

export const wateringEventsApi = createApi({
  reducerPath: 'wateringEventsApi',
  baseQuery: baseQuery,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getWateringEventsList: builder.query({
      query: () => '/api/events',
    }),
    createWateringEvent: builder.mutation({
      query: (body) => {
        const { ...requestBody } = body;
        return {
          url: `/api/events`,
          method: 'POST',
          body: requestBody,
        };
      },
    }),
  }),
});

export const { useGetWateringEventsListQuery, useCreateWateringEventMutation } = wateringEventsApi;
