import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({
  baseUrl: '',
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
