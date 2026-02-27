import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useToast } from '../../../hooks/useToast'
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'

interface CompanyInvoiceListItem {
  id: number
  invoice_number: string
  status: string
  total_amount: number
  currency: string
}

export default function CompanyInvoiceListPage() {
  const [invoices, setInvoices] = useState<CompanyInvoiceListItem[]>([])
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      try {
        const resp = await fetch('/api/company/invoices/list')
        const data = await resp.json()
        if (!resp.ok) {
          throw new Error(data?.message || 'Failed to load company invoices')
        }
        const items = (data?.data || []) as any[]
        setInvoices(
          items.map((inv) => ({
            id: inv.id,
            invoice_number: inv.invoice_number,
            status: inv.status,
            total_amount: inv.total_amount,
            currency: inv.currency,
          }))
        )
      } catch (e: any) {
        addToast('error', e.message || 'Failed to load company invoices')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [addToast])

  return (
    <AuthenticatedLayout>
      <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Company Invoices</h1>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full border divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Invoice #</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{inv.invoice_number}</td>
                <td className="px-4 py-2 capitalize">{inv.status}</td>
                <td className="px-4 py-2 text-right">
                  {inv.currency} {inv.total_amount?.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/company/invoices/${inv.id}`} className="text-primary-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan={4}>
                  No company invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
    </AuthenticatedLayout>
  )
}
