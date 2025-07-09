import { apiSlice } from '../../apis/apiSlice'

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRevenueSummary: builder.query<any, void>({
      query: () => '/Dashboard/summary',
    }),
    getRevenueOverTime: builder.query<any[], 'week' | 'month' | 'year'>({
      query: (period) => `dashboard/overtime?range=${period}`,
    }),
    getRevenueByCategory: builder.query<any, void>({
      query: () => '/Dashboard/category',
    }),
    getTopProducts: builder.query<any, void>({
      query: () => '/Dashboard/top-products',
    }),
    getTopUsers: builder.query<any, void>({
      query: () => '/Dashboard/top-users',
    }),
    getRevenueByLocation: builder.query<any, void>({
      query: () => '/Dashboard/location',
    }),
    getSpinRevenue: builder.query<any, void>({
      query: () => '/Dashboard/spin-revenue',
    }),
  }),
})

export const {
  useGetRevenueSummaryQuery,
  useGetRevenueOverTimeQuery,
  useGetRevenueByCategoryQuery,
  useGetTopProductsQuery,
  useGetTopUsersQuery,
  useGetRevenueByLocationQuery,
  useGetSpinRevenueQuery,
} = dashboardApi
