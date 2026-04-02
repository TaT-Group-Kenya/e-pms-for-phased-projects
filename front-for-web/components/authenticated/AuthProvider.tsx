import React, { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearAuth } from '../../store/auth/slice'
import { selectAccessToken, selectExpiry, selectSessionMaxLimit } from '../../store/auth/selectors'
import { useRouter } from 'next/navigation'
import { useInactivityTimer } from '../../hooks/useInactivityTimer'

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const accessToken = useAppSelector(selectAccessToken)
  const expiry = useAppSelector(selectExpiry)
  const sessionMaxLimit = useAppSelector(selectSessionMaxLimit)
  const [ready, setReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const performLogout = useCallback(() => {
    try {
      dispatch(clearAuth())
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem('auth')
        } catch {}
      }
    } finally {
      router.replace('/sign-in')
    }
  }, [dispatch, router])

  useEffect(() => {
    const checkAuthState = () => {
      try {
        const hasToken = !!accessToken
        const isExpired = typeof expiry === 'number' && expiry <= Date.now()

        if (!hasToken) {
          setIsAuthenticated(false)
          performLogout()
        }else if(isExpired) {
          setIsAuthenticated(false)
          performLogout()
        } else {
          setIsAuthenticated(true)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('AuthProvider auth check error', err)
        setIsAuthenticated(false)
        performLogout()
      } finally {
        setReady(true)
      }
    }

    checkAuthState()
  }, [accessToken, expiry, performLogout])

  // Enforce "no sessions allowed" when sessionMaxLimit is explicitly 0
  useEffect(() => {
    if (!isAuthenticated) return
    if (sessionMaxLimit === 0) {
      setIsAuthenticated(false)
      performLogout()
    }
  }, [isAuthenticated, sessionMaxLimit, performLogout])

  // Inactivity-based auto logout driven by sessionMaxLimit (in minutes)
  useInactivityTimer({
    enabled: isAuthenticated,
    timeoutMinutes: sessionMaxLimit,
    onTimeout: performLogout,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleFocus = () => {
      try {
        const raw = window.localStorage.getItem('auth')
        if (!raw) {
          setIsAuthenticated(false)
          performLogout()
          return
        }

        const parsed = JSON.parse(raw)
        const hasToken = !!parsed?.accessToken
        const exp = parsed?.expiry
        const isExpired = typeof exp === 'number' && exp <= Date.now()

        if (!hasToken || isExpired) {
          setIsAuthenticated(false)
          performLogout()
        }
      } catch {
        setIsAuthenticated(false)
        performLogout()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [performLogout])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted">Loading…</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted">Redirecting…</div>
      </div>
    )
  }

  // children can now safely read auth from the store using selectors
  return <>{children}</>
}

export default AuthProvider
