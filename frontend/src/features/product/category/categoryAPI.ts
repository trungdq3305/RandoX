import { apiSlice } from '../../../apis/apiSlice'

export const categoryAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryDetail: builder.query({
      query: (id) => ({
        url: `/Category/${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['categories'],
    }),
  }),
})
export const { useGetCategoryDetailQuery } = categoryAPI
