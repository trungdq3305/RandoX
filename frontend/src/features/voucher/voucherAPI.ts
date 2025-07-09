// src/features/voucher/voucherAPI.ts
import { apiSlice } from '../../apis/apiSlice'

export const voucherAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllVouchers: builder.query<any, void>({
      query: () => '/Voucher',
      providesTags: ['vouchers'],
    }),
    createVoucher: builder.mutation<any, any>({
      query: (body) => ({
        url: '/Voucher',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['vouchers'],
    }),
    updateVoucher: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/Voucher?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['vouchers'],
    }),
    deleteVoucher: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Voucher?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['vouchers'],
    }),
  }),
})

export const {
  useGetAllVouchersQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
} = voucherAPI
