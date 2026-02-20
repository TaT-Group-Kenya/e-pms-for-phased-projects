import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/slice'

function loadPreloadedAuth() {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = localStorage.getItem('auth')
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    if (parsed && parsed.expiry && typeof parsed.expiry === 'number' && parsed.expiry > Date.now()) {
      return { auth: parsed }
    }
    try { localStorage.removeItem('auth') } catch {}
  } catch {}
  return undefined
}

const preloadedState = loadPreloadedAuth()

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
})

// persist auth slice to localStorage on changes (client-side only)
if (typeof window !== 'undefined') {
  let prev: any = undefined
  store.subscribe(() => {
    try {
      const state = store.getState()
      const auth = state.auth
      if (auth !== prev) {
        localStorage.setItem('auth', JSON.stringify(auth))
        prev = auth
      }
    } catch {}
  })
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
