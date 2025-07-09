import { apiSlice } from '../../apis/apiSlice'

export const cartAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: ({ pageNumber, pageSize }) => ({
        url: '/Cart',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
        },
      }),
      transformResponse: (res) => res,
      providesTags: ['carts'],
    }),
    getTotalAmount: builder.query({
      query: () => ({
        url: '/Cart/refresh-amount',
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['carts'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: `/Cart/clear`,
        method: 'DELETE',
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['carts'],
    }),
  }),
})
export const { useGetCartQuery, useGetTotalAmountQuery, useClearCartMutation } =
  cartAPI
