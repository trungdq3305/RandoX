import { apiSlice } from '../../apis/apiSlice'

export const productSetApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProductSets: builder.query<any, void>({
      query: () => '/ProductSet',
      providesTags: ['products'],
    }),
    createProductSet: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ProductSet',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['products'],
    }),
    updateProductSet: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/ProductSet?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['products'],
    }),
    deleteProductSet: builder.mutation<any, string>({
      query: (id) => ({
        url: `/ProductSet?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['products'],
    }),
  }),
});

export const {
  useGetAllProductSetsQuery,
  useCreateProductSetMutation,
  useUpdateProductSetMutation,
  useDeleteProductSetMutation,
} = productSetApi;
