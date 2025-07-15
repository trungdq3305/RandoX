import { apiSlice } from '../../apis/apiSlice'

export const auctionAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // [1] Gửi vật phẩm đấu giá
    submitAuctionItem: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/AuctionItem',
        method: 'POST',
        body,
        formData: true,
      }),
    }),

    // [2] Duyệt vật phẩm
    approveAuctionItem: builder.mutation<
      any,
      { itemId: string; durationMinutes: number }
    >({
      query: ({ itemId, durationMinutes }) => ({
        url: `/AuctionItem/${itemId}/approve?durationMinutes=${durationMinutes}`,
        method: 'POST',
      }),
    }),

    // [3] Từ chối vật phẩm
    rejectAuctionItem: builder.mutation<
      any,
      { itemId: string; reason: string }
    >({
      query: ({ itemId, reason }) => ({
        url: `/AuctionItem/${itemId}/reject`,
        method: 'POST',
        body: `"${reason}"`, // gửi đúng string thuần dạng JSON
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    // [4] Lấy danh sách vật phẩm chờ duyệt
    getPendingItems: builder.query<any[], void>({
      query: () => '/AuctionSession/pending-items',
    }),

    // [5] Lấy danh sách phiên đang hoạt động
    // getActiveSessions: builder.query<any[], void>({
    //   query: () => '/AuctionSession/active',
    // }),
    getActiveSessions: builder.query({
      query: () => ({
        url: '/AuctionSession/active',
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['auctions'],
    }),
    // [6] Lấy chi tiết phiên (gồm bid)
    getSessionDetail: builder.query<any, string>({
      query: (sessionId) => `/AuctionSession/${sessionId}`,
    }),

    // [7] Đặt giá (bid)
    placeBid: builder.mutation<any, { sessionId: string; amount: number }>({
      query: ({ sessionId, amount }) => ({
        url: '/AuctionBid/place',
        method: 'POST',
        body: { sessionId, amount },
      }),
    }),

    confirmShipping: builder.mutation<
      void,
      { sessionId: string; address: string }
    >({
      query: ({ sessionId, address }) => ({
        url: `/WinnerConfirm/${sessionId}/shipping`, // ✅ bỏ /api
        method: 'POST',
        body: JSON.stringify(address),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    // [9] Admin xác nhận đã giao hàng (chuyển tiền người bán)
    confirmDeliveryComplete: builder.mutation<any, string>({
      query: (sessionId) => ({
        url: `/AuctionSession/${sessionId}/complete`,
        method: 'POST',
      }),
    }),

    // [10] Lấy các phiên mà người dùng đã thắng
    getWonAuctions: builder.query<any[], void>({
      query: () => '/AuctionSession/won',
    }),

    // [11] Lấy thông tin địa chỉ giao hàng
    getShippingInfo: builder.query<any, string>({
      query: (sessionId) => `/AuctionSession/${sessionId}/shipping-info`,
    }),
  }),
})

export const {
  useSubmitAuctionItemMutation,
  useApproveAuctionItemMutation,
  useRejectAuctionItemMutation,
  useGetPendingItemsQuery,
  useGetActiveSessionsQuery,
  useGetSessionDetailQuery,
  usePlaceBidMutation,
  useConfirmShippingMutation,
  useConfirmDeliveryCompleteMutation,
  useGetWonAuctionsQuery,
  useGetShippingInfoQuery,
} = auctionAPI
