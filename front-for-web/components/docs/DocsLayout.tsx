import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const navItems = [
  { href: '/docs', label: 'Overview' },
  { href: '/docs/getting-started', label: 'Getting Started' },
  { href: '/docs/dashboard', label: 'Dashboard' },
  { href: '/docs/customers', label: 'Customers' },
  { href: '/docs/companies', label: 'Companies' },
  { href: '/docs/quotations', label: 'Quotations' },
  { href: '/docs/orders', label: 'Orders' },
  { href: '/docs/projects', label: 'Projects' },
  { href: '/docs/customer-invoices', label: 'Customer Invoices' },// Added customer invoices
  { href: '/docs/company-invoices', label: 'Company Invoices' },// Added company invoices
  { href: '/docs/finance', label: 'Finance' },
  { href: '/docs/reports', label: 'Reports' },// Added reports
  { href: '/docs/system-setup', label: 'System Setup' },
  { href: '/docs/settings', label: 'Settings' },
  { href: '/docs/logout', label: 'Logout' },
  { href: '/docs/faq', label: 'FAQ' },
  { href: '/docs/troubleshooting', label: 'Troubleshooting' },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 px-4 py-8 fixed h-full overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Documentation</h2>
          <p className="text-xs text-gray-500">Version 1.0</p>
        </div>
        
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                    router.asPath === item.href 
                      ? 'bg-blue-600 text-white font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 text-sm text-gray-500">
            <Link href="/docs" className="hover:text-gray-700">Docs</Link>
            {router.asPath !== '/docs' && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900">
                  {navItems.find(item => item.href === router.asPath)?.label || 'Page'}
                </span>
              </>
            )}
          </div>
          
          {/* Page Content */}
          <article className="prose prose-blue max-w-none">
            {children}
          </article>
          
          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <div className="flex justify-between items-center">
              <span>© 2024 Documentation</span>
              <Link href="/docs/screenshots" className="text-blue-600 hover:underline">
                View Screenshot Gallery →
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}