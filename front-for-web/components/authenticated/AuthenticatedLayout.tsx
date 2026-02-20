import React from 'react'
import Sidebar from '../common/Sidebar'
import Topbar from '../common/Topbar'
import Footer from '../common/Footer'
import AuthProvider from './AuthProvider'

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-primary-dark text-slate-900 dark:text-white">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <Topbar />
            <main className="flex-1 p-6">{children}</main>
            <Footer />
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}

export default AuthenticatedLayout
