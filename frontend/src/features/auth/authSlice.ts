import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import type { AuthState, UserData } from '../../types/auth'

// Lấy userData từ Cookies
const userData: UserData | null = Cookies.get('userData')
  ? JSON.parse(Cookies.get('userData') as string)
  : null

const userToken = Cookies.get('userToken')

const initialState: AuthState = {
  userData,
  userToken: userToken ? { token: userToken } : null,
  isAuthenticated: !!userData,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    login: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload

      const decodedToken: any = jwtDecode(token)

      const userData: UserData = {
        email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        exp: decodedToken.exp,
        id: ''
      }

      state.userData = userData

      state.userToken = { token }
      state.isAuthenticated = true

      const expirationDate = new Date(userData.exp * 1000)
      Cookies.set('userData', JSON.stringify(userData), {
        expires: expirationDate,
      })
      Cookies.set('userToken', token, { expires: expirationDate })

      if (userData.role === 'Customer') {
        window.location.href = '/'
      } else if (userData.role === 'Staff') {
        window.location.href = '/staff/customer-account'
      } else if (userData.role === 'Manager') {
        window.location.href = '/manager/products'
      }
      else {
        window.location.href = `/admin/dashboard`
      }
    },

    logout: (state) => {
      state.userData = null
      state.userToken = null
      state.isAuthenticated = false

      Cookies.remove('userData')
      Cookies.remove('userToken')
    },
  },
})

export const { login, logout, setLoading } = authSlice.actions
export default authSlice.reducer
export const selectAuthUser = (state: { authSlice: AuthState }) =>
  state.authSlice
