import { apiSlice } from '../../apis/apiSlice'

export const emailAPI = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        confirmEmail: builder.mutation({
            query: (params) => ({
                url: `/Account/confirm-email?${new URLSearchParams(params).toString()}`,
                method: 'POST',
            }),
        }),
    }),
})

export const { useConfirmEmailMutation } = emailAPI
