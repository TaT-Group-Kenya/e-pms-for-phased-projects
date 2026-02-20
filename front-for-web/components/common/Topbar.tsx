import React from 'react'
import { useAppDispatch } from '../../store/hooks'
import { clearAuth } from '../../store/auth/slice'
import { useRouter } from 'next/router'

const Topbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  function handleLogout() {
    dispatch(clearAuth())
    try { localStorage.removeItem('auth') } catch {}
    void router.push('/sign-in')
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-card dark:bg-primary-dark border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">☰</button>
        <div className="text-lg font-medium">Projects</div>
      </div>

      <div className="flex items-center gap-4">
        <input placeholder="Search" className="px-3 py-2 rounded-lg border border-gray-200 bg-card dark:bg-transparent dark:border-gray-700" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <button onClick={handleLogout} className="ml-2 py-2 px-3 rounded bg-secondary text-white hover:opacity-95">Logout</button>
      </div>
    </header>
  )
}

export default Topbar
