import { apiSlice } from '../../apis/apiSlice'

export const voucherAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVoucherList: builder.query({
      query: ({ pageNumber, pageSize }) => ({
        url: '/Voucher',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
        },
      }),
      transformResponse: (res) => res,
      providesTags: ['vouchers'],
    }),
  }),
})
export const { useGetVoucherListQuery } = voucherAPI
