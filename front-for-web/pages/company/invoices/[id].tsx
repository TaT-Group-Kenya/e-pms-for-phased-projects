import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useToast } from '../../../hooks/useToast'

interface CompanyInvoiceItem {
  id: number
  item_name: string
  item_description?: string | null
  item_amount: number
  projectPhase?: {
    id: number
    code?: string | null
    name: string
  } | null
}

interface CompanyInvoiceTaxItem {
  id: number
  item_name: string
  item_type: string
  item_value?: number | null
}

interface CompanyInvoice {
  id: number
  invoice_number: string
  status: string
  subtotal_amount: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  currency: string
  payment_terms?: string | null
  notes_to_customer?: string | null
  invoiceItems: CompanyInvoiceItem[]
  taxitems: CompanyInvoiceTaxItem[]
}

export default function CompanyInvoiceDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [invoice, setInvoice] = useState<CompanyInvoice | null>(null)
  const [loading, setLoading] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const { addToast } = useToast()

  const fetchInvoice = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const resp = await fetch(`/api/company/invoices/${id}`)
      const data = await resp.json()
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to load company invoice')
      }
      const inv = (data?.data || data) as any
      setInvoice(inv)
    } catch (e: any) {
      addToast('error', e.message || 'Failed to load company invoice')
    } finally {
      setLoading(false)
    }
  }, [id, addToast])

  useEffect(() => {
    fetchInvoice()
  }, [fetchInvoice])

  const handleSendEmail = async () => {
    if (!id) return
    setSendingEmail(true)
    try {
      const resp = await fetch('/api/company/invoices/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to send company invoice email')
      }
      addToast('success', data?.message || 'Company invoice emailed successfully')
    } catch (e: any) {
      addToast('error', e.message || 'Failed to send company invoice email')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!id) return
    setDownloading(true)
    try {
      const resp = await fetch(`/api/company/invoices/download-pdf?id=${id}`)
      if (!resp.ok) {
        const data = await resp.json().catch(() => null)
        throw new Error(data?.message || 'Failed to download company invoice PDF')
      }
      const blob = await resp.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `company-invoice-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      addToast('error', e.message || 'Failed to download company invoice PDF')
    } finally {
      setDownloading(false)
    }
  }

  if (loading || !invoice) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Company Invoice</h1>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Company Invoice {invoice.invoice_number}</h1>
          <div className="text-sm text-gray-500 capitalize">Status: {invoice.status}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            {downloading ? 'Downloading…' : 'Download PDF'}
          </button>
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail}
            className="px-3 py-2 text-sm rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {sendingEmail ? 'Sending…' : 'Send Email'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Line Items</h2>
          <table className="min-w-full border divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.invoiceItems?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="font-medium">{item.item_name}</div>
                    {item.projectPhase && (
                      <div className="text-xs text-gray-500">
                        Phase: {item.projectPhase.code ? `${item.projectPhase.code} - ` : ''}
                        {item.projectPhase.name}
                      </div>
                    )}
                    {item.item_description && (
                      <div className="text-xs text-gray-500">{item.item_description}</div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {invoice.currency} {item.item_amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {(!invoice.invoiceItems || invoice.invoiceItems.length === 0) && (
                <tr>
                  <td className="px-4 py-4 text-center text-gray-500" colSpan={2}>
                    No items.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <div className="border rounded p-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {invoice.currency} {invoice.subtotal_amount.toFixed(2)}
              </span>
            </div>
            {invoice.tax_amount > 0 && (
              <div className="flex justify-between">
                <span>Tax</span>
                <span>
                  {invoice.currency} {invoice.tax_amount.toFixed(2)}
                </span>
              </div>
            )}
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span>
                  -{invoice.currency} {invoice.discount_amount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t pt-2 mt-1 flex justify-between font-semibold">
              <span>Total</span>
              <span>
                {invoice.currency} {invoice.total_amount.toFixed(2)}
              </span>
            </div>
          </div>

          {(invoice.payment_terms || invoice.notes_to_customer) && (
            <div className="mt-4 text-sm border rounded p-3 space-y-1">
              {invoice.payment_terms && (
                <div>
                  <div className="font-medium mb-0.5">Payment Terms</div>
                  <div className="text-gray-600 whitespace-pre-line">{invoice.payment_terms}</div>
                </div>
              )}
              {invoice.notes_to_customer && (
                <div>
                  <div className="font-medium mb-0.5">Notes</div>
                  <div className="text-gray-600 whitespace-pre-line">{invoice.notes_to_customer}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
