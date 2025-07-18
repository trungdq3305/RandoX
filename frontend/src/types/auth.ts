export interface UserToken {
  token: string
}

export interface UserData {
  id: string
  role: string
  email: string
  exp: number
}

export interface AuthState {
  userData: UserData | null
  userToken: UserToken | null
  isAuthenticated: boolean
  isLoading: boolean
}
