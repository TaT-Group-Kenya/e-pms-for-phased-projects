import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'
import { useToast } from '../../../hooks/useToast'
import { selectAccessToken } from '../../../store/auth/selectors'
import { ToastContainer } from '../../../components/common/Toast'

interface CustCreditNote {
  id: number
  invoice_id: number | null
  title: string | null
  description: string | null
  status: string
  subtotal_amount: number
  tax_amount: number
  total_amount: number
  currency: string
  notes_to_customer: string | null
  created_at: string | null
  updated_at: string | null
}

interface CustCreditNoteTaxItem {
  id: number
  credit_note_id: number
  tax_id: number | null
  item_name: string
  item_type: string
  item_value: number
}

type CreditNoteStatus = 'draft' | 'raised' | 'refunded'

const CustCreditNoteDetailPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query

  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const [creditNote, setCreditNote] = useState<CustCreditNote | null>(null)
  const [taxItems, setTaxItems] = useState<CustCreditNoteTaxItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'tax'>('overview')
  const [updatingStatus, setUpdatingStatus] = useState<CreditNoteStatus | null>(null)

  const fetchCreditNote = async () => {
    if (!id || !accessToken) return

    setLoading(true)
    try {
      const resp = await fetch(`/api/cust-credit-notes/${id}` as string, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to load customer credit note')
      }

      const cn = data?.data || data

      const mapped: CustCreditNote = {
        id: cn.id,
        invoice_id:
          typeof cn.invoice_id === 'number' ? cn.invoice_id : cn.invoice_id ? Number(cn.invoice_id) : null,
        title: cn.title ?? null,
        description: cn.description ?? null,
        status: cn.status || 'draft',
        subtotal_amount: Number(cn.subtotal_amount ?? 0),
        tax_amount: Number(cn.tax_amount ?? 0),
        total_amount: Number(cn.total_amount ?? 0),
        currency: cn.currency || 'USD',
        notes_to_customer: cn.notes_to_customer ?? null,
        created_at: cn.created_at ?? null,
        updated_at: cn.updated_at ?? null,
      }

      setCreditNote(mapped)
    } catch (e: any) {
      addToast(e?.message || 'Failed to load customer credit note', 'error')
      setCreditNote(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchTaxItems = async () => {
    if (!id || !accessToken) return

    try {
      const resp = await fetch(`/api/cust-credit-note-tax-items?credit_note_id=${id}` as string, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to load credit note tax items')
      }

      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []

      const mapped: CustCreditNoteTaxItem[] = (items || []).map((t: any) => ({
        id: t.id,
        credit_note_id: t.credit_note_id,
        tax_id: t.tax_id ?? null,
        item_name: t.item_name,
        item_type: t.item_type,
        item_value: Number(t.item_value ?? 0),
      }))

      setTaxItems(mapped)
    } catch (e: any) {
      addToast(e?.message || 'Failed to load credit note tax items', 'error')
      setTaxItems([])
    }
  }

  const updateStatus = async (status: CreditNoteStatus) => {
    if (!creditNote || !accessToken) return

    setUpdatingStatus(status)
    try {
      const resp = await fetch(`/api/cust-credit-notes/${creditNote.id}` as string, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      })

      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to update credit note status')
      }

      addToast(data?.message || 'Status updated successfully', 'success')
      await fetchCreditNote()
    } catch (e: any) {
      addToast(e?.message || 'Failed to update credit note status', 'error')
    } finally {
      setUpdatingStatus(null)
    }
  }

  useEffect(() => {
    if (!id || !accessToken) return
    fetchCreditNote()
    fetchTaxItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken])

  const formatCurrency = (value: number, currency: string) => {
    if (Number.isNaN(value)) return '-'
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0)
  }

  const getStatusBadgeClass = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-warning-50 text-warning-500'
      case 'raised':
        return 'bg-info-50 text-info-500'
      case 'refunded':
        return 'bg-success-50 text-success-500'
      default:
        return 'bg-gray-50 text-gray-500'
    }
  }

  if (loading && !creditNote) {
    return (
      <AuthenticatedLayout>
        <div className="p-[20px] md:p-[25px]">
          <div className="space-y-[10px]">
            {[...Array(5)].map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div
                key={index}
                className="h-[60px] bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
              />
            ))}
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!loading && !creditNote) {
    return (
      <AuthenticatedLayout>
        <div className="text-center py-[60px]">
          <p className="text-gray-500 dark:text-gray-400 mb-[20px]">
            Customer credit note not found
          </p>
          <Link
            href="/cust/credit-notes"
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[24px] py-[11px] bg-primary-500 text-white hover:bg-primary-600"
          >
            Back to Customer Credit Notes
          </Link>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="mb-[25px] md:flex items-center justify-between">
        <div className="mb-[15px] md:mb-0">
          <h5 className="!mb-1">
            Customer Credit Note {creditNote?.title || `#${creditNote?.id}`}
          </h5>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Overview and tax breakdown for this customer credit note.
          </p>
        </div>

        <div className="space-y-[8px] text-right">
          <ul className="flex flex-wrap items-center gap-[10px] text-sm justify-end">
            <li>
              <Link href="/" className="text-gray-500 dark:text-gray-400">
                Dashboard
              </Link>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
            <li>
              <Link href="/cust/credit-notes" className="text-gray-500 dark:text-gray-400">
                Customer Credit Notes
              </Link>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
            <li className="text-primary-500 font-medium">
              {creditNote?.title || `#${creditNote?.id}`}
            </li>
          </ul>

          {creditNote?.invoice_id && (
            <div>
              <Link
                href={`/cust-invoices/${creditNote.invoice_id}`}
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[16px] py-[8px] bg-primary-500 text-white hover:bg-primary-600 text-xs md:text-sm"
              >
                Back to Invoice #{creditNote.invoice_id}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md mb-[20px] md:mb-[25px]">
        <div className="border-b border-gray-100 dark:border-[#172036] px-[20px] md:px-[25px]">
          <div className="flex flex-wrap items-center gap-[15px]">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-[12px] border-b-2 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-primary-500'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tax')}
              className={`py-[12px] border-b-2 text-sm font-medium transition-colors ${
                activeTab === 'tax'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-primary-500'
              }`}
            >
              Tax Items
            </button>
          </div>
        </div>

        <div className="p-[20px] md:p-[25px]">
          {activeTab === 'overview' && creditNote && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div className="space-y-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Credit Note</span>
                  <span className="font-medium text-sm">
                    {creditNote.title || `Credit Note #${creditNote.id}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Related Invoice</span>
                  {creditNote.invoice_id ? (
                    <Link
                      href={`/cust-invoices/${creditNote.invoice_id}`}
                      className="font-medium text-sm text-primary-500 hover:text-primary-600 hover:underline"
                    >
                      Invoice #{creditNote.invoice_id}
                    </Link>
                  ) : (
                    <span className="font-medium text-sm">-</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Status</span>
                  <span
                    className={`inline-flex items-center px-[10px] py-[4px] rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(
                      creditNote.status,
                    )}`}
                  >
                    {creditNote.status}
                  </span>
                </div>
              </div>

              <div className="space-y-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(creditNote.subtotal_amount, creditNote.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Tax</span>
                  <span className="font-semibold">
                    {formatCurrency(creditNote.tax_amount, creditNote.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Total</span>
                  <span className="font-semibold text-primary-500">
                    {formatCurrency(creditNote.total_amount, creditNote.currency)}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 dark:text-gray-400 text-sm mb-[4px]">
                    Description
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {creditNote.description || '(No description provided)'}
                  </p>
                </div>

                {creditNote.notes_to_customer && (
                  <div>
                    <span className="block text-gray-500 dark:text-gray-400 text-sm mb-[4px]">
                      Notes to Customer
                    </span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {creditNote.notes_to_customer}
                    </p>
                  </div>
                )}

                <div className="pt-[10px] border-t border-gray-100 dark:border-[#172036] mt-[10px] flex flex-wrap items-center gap-[8px]">
                  <span className="text-gray-500 dark:text-gray-400 text-xs mr-[8px]">
                    Change Status:
                  </span>
                  <button
                    type="button"
                    disabled={creditNote.status === 'draft' || updatingStatus !== null}
                    onClick={() => updateStatus('draft')}
                    className="px-[10px] py-[4px] text-xs rounded-md border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark Draft
                  </button>
                  <button
                    type="button"
                    disabled={creditNote.status === 'raised' || updatingStatus !== null}
                    onClick={() => updateStatus('raised')}
                    className="px-[10px] py-[4px] text-xs rounded-md border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark Raised
                  </button>
                  <button
                    type="button"
                    disabled={creditNote.status === 'refunded' || updatingStatus !== null}
                    onClick={() => updateStatus('refunded')}
                    className="px-[10px] py-[4px] text-xs rounded-md border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark Refunded
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <thead className="text-black dark:text-white">
                  <tr>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Tax Name
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Type
                    </th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {taxItems.length > 0 ? (
                    taxItems.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                      >
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          {t.item_name}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          {t.item_type}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          {t.item_type === 'percentage'
                            ? `${t.item_value}%`
                            : formatCurrency(t.item_value, creditNote?.currency || 'USD')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center px-[20px] py-[40px] text-gray-500 dark:text-gray-400"
                      >
                        No tax items found for this credit note
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default CustCreditNoteDetailPage
