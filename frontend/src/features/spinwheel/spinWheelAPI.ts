// src/features/spinwheel/spinWheelAPI.ts
import { apiSlice } from '../../apis/apiSlice'

export const spinWheelAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSpinWheelHistory: builder.query<any[], void>({
      query: () => '/SpinWheel/history',
    }),
    getAllWheels: builder.query<any[], void>({
      query: () => '/SpinWheel',
      providesTags: ['SpinWheels'],
    }),
    getWheelById: builder.query<any, string>({
      query: (id) => `/SpinWheel/${id}`,
      providesTags: ['SpinWheels'],
    }),
    getUserSpinHistory: builder.query<any[], void>({
      query: () => '/SpinWheel/history/me',
    }),
    spinWheel: builder.mutation<any, string>({
      query: (wheelId) => ({
        url: `/SpinWheel/spin/${wheelId}`,
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useGetSpinWheelHistoryQuery,
  useGetAllWheelsQuery,
  useGetWheelByIdQuery,
  useGetUserSpinHistoryQuery,
  useSpinWheelMutation,
} = spinWheelAPI
