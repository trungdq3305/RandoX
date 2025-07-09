import { apiSlice } from '../../apis/apiSlice'

export const paymentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Tạo URL thanh toán dành cho service case
        createPayment: builder.mutation({
            query: ({ orderId }) => ({
                url: `/Transaction/vnpay/create?orderId=${orderId}`,
                method: 'POST',
            }),
            transformResponse: (res) => res?.redirectUrl || res, // Điều chỉnh dựa trên phản hồi
        }),
        createPurchasePaymentHistory: builder.mutation({
            query: (params) => ({
                url: `/Transaction/vnpay/callback?${new URLSearchParams(params).toString()}`,
                method: 'POST',
            }),
        }),
    }),
})

export const { useCreatePaymentMutation, useCreatePurchasePaymentHistoryMutation } = paymentApi
