import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UserProfile = {
  id?: string
  name?: string
  email?: string
  [key: string]: any
}

type AuthState = {
  user: UserProfile | null
  accessToken: string | null
  expiry: number | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  expiry: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user?: UserProfile; accessToken?: string; expiry?: number }>) {
      const { user, accessToken, expiry } = action.payload
      if (user !== undefined) state.user = user || null
      if (accessToken !== undefined) state.accessToken = accessToken || null
      if (expiry !== undefined) state.expiry = expiry || null
    },
    setUser(state, action: PayloadAction<UserProfile | null>) {
      state.user = action.payload
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload
    },
    setExpiry(state, action: PayloadAction<number | null>) {
      state.expiry = action.payload
    },
    clearAuth(state) {
      state.user = null
      state.accessToken = null
      state.expiry = null
    },
  },
})

export const { setCredentials, setUser, setAccessToken, setExpiry, clearAuth } = authSlice.actions

export type { UserProfile }

export default authSlice.reducer
