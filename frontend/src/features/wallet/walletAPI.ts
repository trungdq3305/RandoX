// src/features/voucher/voucherAPI.ts
import { apiSlice } from '../../apis/apiSlice'

export const walletAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWalletBalance: builder.query({
            query: () => ({
                url: '/Wallet/wallet',
                method: 'GET',
            }),
            transformResponse: (res) => res,
            providesTags: ['wallets'],
        }),
    }),
})

export const {
useGetWalletBalanceQuery
} = walletAPI
