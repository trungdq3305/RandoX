import { apiSlice } from '../../apis/apiSlice'

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL
    getAllCategories: builder.query<any, void>({
      query: () => 'Category',
      providesTags: ['categories'],
    }),

    // CREATE
    createCategory: builder.mutation<
      void,
      { categoryName: string; description: string }
    >({
      query: (body) => ({
        url: 'Category',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['categories'],
    }),

    // UPDATE
    updateCategory: builder.mutation<
      void,
      { id: string; categoryName: string; description: string }
    >({
      query: ({ id, ...body }) => ({
        url: `Category?id=${id}`, // id nằm trong query
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['categories'],
    }),

    // DELETE
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `Category?id=${id}`, // id nằm trong query
        method: 'DELETE',
      }),
      invalidatesTags: ['categories'],
    }),
  }),
})

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi
