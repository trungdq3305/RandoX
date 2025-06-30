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
    }),
})
export const { useGetProductListQuery, useGetProductDetailQuery } = productAPI
