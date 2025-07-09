import { apiSlice } from '../../apis/apiSlice'

export const orderAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: ({ shippingCost, voucherId }) => ({
        url: `/Order?shippingCost=${shippingCost}&voucherId=${voucherId}`,
        method: 'POST',
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['orders'],
    }),
  }),
})
export const { useCreateOrderMutation } = orderAPI
