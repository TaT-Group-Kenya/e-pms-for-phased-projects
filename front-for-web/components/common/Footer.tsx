import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="px-6 py-4 text-sm text-muted border-t border-gray-100 dark:border-gray-800 bg-card dark:bg-primary-dark">
      <div className="max-w-7xl mx-auto text-center">© {new Date().getFullYear()} e-PMS — All rights reserved.</div>
    </footer>
  )
}

export default Footer
