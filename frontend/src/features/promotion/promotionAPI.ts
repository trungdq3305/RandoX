// src/features/promotion/promotionAPI.ts
import { apiSlice } from '../../apis/apiSlice'

export const promotionAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPromotions: builder.query<any, void>({
      query: () => '/Promotion',
      providesTags: ['promotions'],
    }),
    createPromotion: builder.mutation<any, any>({
      query: (body) => ({
        url: '/Promotion',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['promotions'],
    }),
    updatePromotion: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/Promotion?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['promotions'],
    }),
    deletePromotion: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Promotion?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['promotions'],
    }),
  }),
})

export const {
  useGetAllPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = promotionAPI
