import { apiSlice } from '../../apis/apiSlice'

export const productSetApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProductSets: builder.query<any, void>({
      query: () => '/ProductSet',
      providesTags: ['productSets'],
    }),
    createProductSet: builder.mutation<any, any>({
      query: (body) => ({
        url: '/ProductSet',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['productSets'],
    }),
    getProductSetDetail: builder.query({
      query: (id) => ({
        url: `/ProductSet/${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['productSets'],
    }),
    updateProductSet: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/ProductSet?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['productSets'],
    }),
    addProductSetToCart: builder.mutation({
      query: ({ setId, amount }) => ({
        url: `/ProductSet/add-to-cart?setId=${setId}&amount=${amount}`,
        method: 'POST',
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['productSets'],
    }),
    deleteProductSet: builder.mutation<any, string>({
      query: (id) => ({
        url: `/ProductSet?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['productSets'],
    }),
  }),
})

export const {
  useGetAllProductSetsQuery,
  useCreateProductSetMutation,
  useUpdateProductSetMutation,
  useDeleteProductSetMutation,
  useGetProductSetDetailQuery,
  useAddProductSetToCartMutation,
} = productSetApi
