import React from 'react'

const Topbar: React.FC = () => {
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
      </div>
    </header>
  )
}

export default Topbar
