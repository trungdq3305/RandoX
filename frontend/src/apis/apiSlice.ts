import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'
// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_ENDPOINT + '/',
  prepareHeaders: (headers) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = Cookies.get('userToken') || ''
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
  responseHandler: async (response) => {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    } else {
      return await response.text() // chấp nhận trả text thuần
    }
  },
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: [
    'test',
    'account',
    'countries',
    'categories',
    'manufacturers',
    'blogs',
    'customers',
    'staff',
    'dashboard',
    'products',
    'categories',
    'carts',
    'promotions',
    'vouchers',
    'accounts',
    'SpinWheels',
    'productSets',
    'orders',
    'vouchers',
    'wallets',
    'auctions'
  ],
  endpoints: () => ({}),
})
