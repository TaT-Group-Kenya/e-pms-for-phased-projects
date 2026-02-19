import React from 'react'
import Link from 'next/link'

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-card dark:bg-primary-dark border-r border-gray-100 dark:border-gray-800 h-screen sticky top-0">
      <div className="p-6">
        <Link href="/dashboard"><a className="text-xl font-bold text-primary">Trezo</a></Link>
      </div>

      <nav className="px-4 py-2 text-sm text-muted">
        <ul className="space-y-1">
          <li>
            <Link href="/dashboard"><a className="flex items-center p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800">Dashboard</a></Link>
          </li>
          <li>
            <a className="flex items-center p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800">Projects</a>
          </li>
          <li>
            <a className="flex items-center p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800">Invoices</a>
          </li>
          <li>
            <a className="flex items-center p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800">Reports</a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
