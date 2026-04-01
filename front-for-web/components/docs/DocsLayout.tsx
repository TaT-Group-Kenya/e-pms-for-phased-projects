import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const navItems = [
  { href: '/docs', label: 'Overview' },
  { href: '/docs/getting-started', label: 'Getting Started' },
  { href: '/docs/companies', label: 'Companies' },
  { href: '/docs/customers', label: 'Customers' },
  { href: '/docs/projects', label: 'Projects' },
  { href: '/docs/finance', label: 'Finance' },
  { href: '/docs/quotations', label: 'Quotations' },
  { href: '/docs/orders', label: 'Orders' },
  { href: '/docs/dashboard', label: 'Dashboard' },
  { href: '/docs/settings', label: 'Settings' },
  { href: '/docs/faq', label: 'FAQ' },
  { href: '/docs/troubleshooting', label: 'Troubleshooting' },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r px-4 py-8">
        <h2 className="text-xl font-bold mb-6">Documentation</h2>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} legacyBehavior>
                  <a
                    className={`block px-3 py-2 rounded hover:bg-blue-100 transition-colors ${
                      router.asPath === item.href ? 'bg-blue-500 text-white font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 px-8 py-10 max-w-4xl mx-auto">
        {children}
      </main>
    </div>
  );
}
