import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserRole } from './roles'

type UserGroup = {
  id: number | string
  name: string
  // roles from this group; overall user roles are also exposed on UserProfile.roles
  roles?: UserRole[]
}

type UserCompany = {
  id: number | string
  name: string
  [key: string]: any
}

type UserCustomer = {
  id: number | string
  name: string
  [key: string]: any
}

type UserProfile = {
  id: number | string
  email: string
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  email_verified_at: string | null
  updated_at: string | null
  updated_by: number | string | null
  created_at: string | null
  created_by: number | string | null
  remember_token: string | null
  avatar_pic: string | null
  category: string | null
  is_active: boolean
  company_id: number | string | null
  customer_id: number | string | null
  session_max_limit: number | null
  company?: UserCompany | null
  customer?: UserCustomer | null
  groups?: UserGroup[]
  roles?: UserRole[]
}

type AuthState = {
  user: UserProfile | null
  accessToken: string | null
  tokenType: string | null
  expiry: number | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  tokenType: null,
  expiry: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user?: UserProfile; accessToken?: string; tokenType?: string; expiry?: number }>) {
      const { user, accessToken, tokenType, expiry } = action.payload
      if (user !== undefined) state.user = user || null
      if (accessToken !== undefined) state.accessToken = accessToken || null
      if (tokenType !== undefined) state.tokenType = tokenType || null
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
      state.tokenType = null
      state.expiry = null
    },
  },
})

export const { setCredentials, setUser, setAccessToken, setExpiry, clearAuth } = authSlice.actions

export type { UserProfile, UserGroup, UserRole }

export default authSlice.reducer
