import { apiSlice } from '../../apis/apiSlice'

export const accountAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAccounts: builder.query<any[], void>({
      query: () => '/Account/all',
      providesTags: ['accounts'],
    }),

    getAccountById: builder.query<any, string>({
      query: (id) => `/Account/${id}`,
      providesTags: ['accounts'],
    }),

    updateAccount: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/Account/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['accounts'],
    }),

    deleteAccount: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Account/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['accounts'],
    }),
    registerAccount: builder.mutation({
      query: ({ data }) => ({
        url: '/Account/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['accounts'],
    }),
  }),
})

export const {
  useGetAllAccountsQuery,
  useGetAccountByIdQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useRegisterAccountMutation
} = accountAPI
