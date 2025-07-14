export interface UserToken {
  token: string
}

export interface UserData {
  email: string
  id: string
  address: string
  role: string
  name: string
  PphoneNumber: string
  exp: number
  facility: string
}

export interface AuthState {
  userData: UserData | null
  userToken: UserToken | null
  isAuthenticated: boolean
  isLoading: boolean
}
