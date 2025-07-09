import { apiSlice } from '../../apis/apiSlice'

export const productAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductList: builder.query({
      query: ({ currentPage, pageSize }) => ({
        url: '/Product',
        method: 'GET',
        params: {
          currentPage,
          pageSize,
        },
      }),
      transformResponse: (res) => res,
      providesTags: ['products'],
    }),
    getProductDetail: builder.query({
      query: (id) => ({
        url: `/Product/${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['products'],
    }),
    getAllProducts: builder.query<any, void>({
      query: () => 'Product',
      providesTags: ['products'],
    }),
    addProductToCart: builder.mutation({
      query: ({ productId, amount }) => ({
        url: `/Product/add-to-cart?productId=${productId}&amount=${amount}`,
        method: 'POST',
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['products'],
    }),
    createProduct: builder.mutation<any, any>({
      query: (body) => ({
        url: '/Product',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['products'],
    }),
    updateProduct: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/Product?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['products'],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Product?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['products'],
    }),
    getAllProductsDropdown: builder.query<any, void>({
      query: () => '/Product',
    }),
  }),
})
export const {
  useGetProductListQuery,
  useGetProductDetailQuery,
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsDropdownQuery,
  useAddProductToCartMutation,
} = productAPI
