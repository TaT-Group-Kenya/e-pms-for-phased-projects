import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearAuth } from '../../store/auth/slice'
import { selectExpiry } from '../../store/auth/selectors'

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch()
  const expiry = useAppSelector(selectExpiry)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Check expiry and clear if expired
    try {
      if (expiry && typeof expiry === 'number' && expiry <= Date.now()) {
        dispatch(clearAuth())
        try { localStorage.removeItem('auth') } catch {}
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('AuthProvider expiry check error', err)
    } finally {
      setReady(true)
    }
  }, [expiry, dispatch])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-muted">Loading…</div>
      </div>
    )
  }

  // children can now safely read auth from the store using selectors
  return <>{children}</>
}

export default AuthProvider
