import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout'
import { ToastContainer } from '../../components/common/Toast'
import { useToast } from '../../hooks/useToast'
import { selectAccessToken } from '../../store/auth/selectors'

interface CustInvoiceItem {
  id: number
  item_name: string
  item_description?: string | null
  quantity?: number | null
  item_amount: number
  total?: number | null
}

interface CustInvoiceTaxItem {
  id: number
  item_name: string
  item_type: string
  item_value?: number | null
  item_amount?: number | null
}

interface CustPaymentSummary {
  id: number
  payment_date: string | null
  amount_paid: number
  currency: string
  payment_status: string
}

interface CustCreditNoteSummary {
  id: number
  title: string
  status: string
  total_amount: number
  currency: string
}

interface CustomerSummary {
  id: number
  name: string
  email?: string | null
  phone?: string | null
}

interface ProjectSummary {
  id: number
  code: string
  name: string
  status?: string | null
}

interface OrderSummary {
  id: number
  order_number: string
  status: string
  total_amount: number
  currency: string
}

interface CustInvoice {
  id: number
  invoice_number: string
  title?: string | null
  description?: string | null
  status: string
  currency: string
  subtotal_amount: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  payment_terms?: string | null
  notes_to_customer?: string | null
  invoiceItems?: CustInvoiceItem[]
  taxitems?: CustInvoiceTaxItem[]
  payments?: CustPaymentSummary[]
  creditnotes?: CustCreditNoteSummary[]
  customer?: CustomerSummary
  project?: ProjectSummary
  order?: OrderSummary
}

export default function CustInvoiceDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const [invoice, setInvoice] = useState<CustInvoice | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPaymentTerms, setEditPaymentTerms] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const [markingSent, setMarkingSent] = useState(false)

  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'bank_transfer' | 'check'>('cash')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'complete'>('complete')
  const [paymentCurrency, setPaymentCurrency] = useState('')
  const [bankName, setBankName] = useState('')
  const [checkNumber, setCheckNumber] = useState('')
  const [transactionReference, setTransactionReference] = useState('')
  const [receiptNumber, setReceiptNumber] = useState('')
  const [exchangeRate, setExchangeRate] = useState('1')
  const [feeOrCharge, setFeeOrCharge] = useState('0')
  const [savingPayment, setSavingPayment] = useState(false)

  const [isAddingCreditNote, setIsAddingCreditNote] = useState(false)
  const [creditNoteTitle, setCreditNoteTitle] = useState('')
  const [creditNoteDescription, setCreditNoteDescription] = useState('')
  const [creditNoteNotes, setCreditNoteNotes] = useState('')
  const [savingCreditNote, setSavingCreditNote] = useState(false)

  const { toasts, addToast, removeToast } = useToast()
  const accessToken = useSelector(selectAccessToken)

  const fetchInvoice = useCallback(async () => {
    if (!id) return
    if (!accessToken) return

    setLoading(true)
    try {
      const resp = await fetch(`/api/cust-invoices/${id}` as string, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to load invoice')
      }

      const inv = (data?.data || data) as CustInvoice
      setInvoice(inv)
    } catch (e: any) {
      addToast(e.message || 'Failed to load invoice', 'error')
    } finally {
      setLoading(false)
    }
  }, [id, accessToken, addToast])

  useEffect(() => {
    fetchInvoice()
  }, [fetchInvoice])

  const handleSendEmail = async () => {
    if (!id) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    setSendingEmail(true)
    try {
      const resp = await fetch('/api/cust-invoices/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to send invoice email')
      }

      addToast(data?.message || 'Invoice emailed successfully', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to send invoice email', 'error')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!id) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    setDownloading(true)
    try {
      const resp = await fetch(`/api/cust-invoices/download-pdf?id=${id}` as string, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!resp.ok) {
        const data = await resp.json().catch(() => null)
        throw new Error(data?.message || 'Failed to download invoice PDF')
      }

      const blob = await resp.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      addToast(e.message || 'Failed to download invoice PDF', 'error')
    } finally {
      setDownloading(false)
    }
  }

  const handleStartEdit = () => {
    if (!invoice) return

    setEditTitle(invoice.title || '')
    setEditDescription(invoice.description || '')
    setEditPaymentTerms(invoice.payment_terms || '')
    setEditNotes(invoice.notes_to_customer || '')
    setIsEditing(true)
  }

  const handleSaveHeader = async () => {
    if (!id) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    setSaving(true)
    try {
      const resp = await fetch(`/api/cust-invoices/${id}` as string, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: editTitle || null,
          description: editDescription || null,
          payment_terms: editPaymentTerms || null,
          notes_to_customer: editNotes || null,
        }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to update invoice')
      }

      const inv = (data?.data || data) as CustInvoice
      setInvoice(inv)
      setIsEditing(false)
      addToast('Invoice updated successfully', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to update invoice', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleMarkAsSent = async () => {
    if (!invoice) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    setMarkingSent(true)
    try {
      const resp = await fetch('/api/cust-invoices/mark-sent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: invoice.id }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to mark invoice as sent')
      }

      const inv = (data?.data || data) as CustInvoice
      setInvoice(inv)
      addToast('Invoice marked as sent.', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to mark invoice as sent', 'error')
    } finally {
      setMarkingSent(false)
    }
  }

  const handleOpenAddPayment = () => {
    if (!invoice) return
    setPaymentAmount('')
    setPaymentDate(new Date().toISOString().slice(0, 10))
    setPaymentMethod('cash')
    setPaymentStatus('complete')
    setPaymentCurrency(invoice.currency)
    setBankName('')
    setCheckNumber('')
    setTransactionReference('')
    setReceiptNumber('')
    setExchangeRate('1')
    setFeeOrCharge('0')
    setIsAddingPayment(true)
  }

  const handleSavePayment = async () => {
    if (!invoice) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    const amount = Number(paymentAmount)
    const rate = Number(exchangeRate || '0')
    const fee = Number(feeOrCharge || '0')

    if (!paymentAmount || Number.isNaN(amount) || amount <= 0) {
      addToast('Enter a valid payment amount.', 'error')
      return
    }

    if (!paymentDate) {
      addToast('Payment date is required.', 'error')
      return
    }

    if (!receiptNumber) {
      addToast('Receipt number is required.', 'error')
      return
    }

    if (Number.isNaN(rate) || rate <= 0) {
      addToast('Enter a valid exchange rate.', 'error')
      return
    }

    if (Number.isNaN(fee) || fee < 0) {
      addToast('Enter a valid fee or charge.', 'error')
      return
    }

    setSavingPayment(true)
    try {
      const resp = await fetch('/api/cust-invoices/add-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: invoice.id,
          amount_paid: amount,
          payment_date: paymentDate,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          currency: paymentCurrency,
          bank_name: bankName || null,
          check_number: checkNumber || null,
          transaction_reference: transactionReference || null,
          receipt_number: receiptNumber,
          exchange_rate: rate,
          fee_or_charge: fee,
        }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to add payment')
      }

      const inv = (data?.data || data) as CustInvoice
      setInvoice(inv)
      setIsAddingPayment(false)
      addToast('Payment recorded successfully.', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to add payment', 'error')
    } finally {
      setSavingPayment(false)
    }
  }

  const handleCreateCreditNote = async () => {
    if (!invoice) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    if (!creditNoteTitle.trim()) {
      addToast('Credit note title is required.', 'error')
      return
    }

    setSavingCreditNote(true)
    try {
      const resp = await fetch('/api/cust-credit-notes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          invoice_id: invoice.id,
          title: creditNoteTitle,
          description: creditNoteDescription || '',
          status: 'draft',
          subtotal_amount: 0,
          tax_amount: 0,
          total_amount: 0,
          currency: invoice.currency,
          notes_to_customer: creditNoteNotes || '',
        }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to create credit note')
      }

      // After creation, refresh invoice to pick up the new credit note
      await fetchInvoice()
      setIsAddingCreditNote(false)
      setCreditNoteTitle('')
      setCreditNoteDescription('')
      setCreditNoteNotes('')
      addToast('Draft credit note created.', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to create credit note', 'error')
    } finally {
      setSavingCreditNote(false)
    }
  }

  if (loading && !invoice) {
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

  if (!loading && !invoice) {
    return (
      <AuthenticatedLayout>
        <div className="text-center py-[60px]">
          <p className="text-gray-500 dark:text-gray-400 mb-[20px]">
            Invoice not found
          </p>
          <Link
            href="/cust-invoices/invoice-list"
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[24px] py-[11px] bg-primary-500 text-white hover:bg-primary-600"
          >
            Back to Customer Invoices
          </Link>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!invoice) return null

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
      case 'sent':
        return 'bg-info-50 text-info-500'
      case 'paid':
        return 'bg-success-50 text-success-500'
      case 'partial-paid':
        return 'bg-warning-50 text-warning-500'
      case 'draft':
      default:
        return 'bg-gray-50 text-gray-500'
    }
  }

  return (
    <AuthenticatedLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-1">Customer Invoice</h5>
          <p className="text-sm text-gray-500">
            Invoice #{invoice.invoice_number}
          </p>
        </div>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/cust-invoices/invoice-list"
              className="hover:text-primary-500"
            >
              Customer Invoices
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            {invoice.invoice_number}
          </li>
        </ol>
      </div>

      {/* Header Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[20px]">
          <div>
            <h4 className="text-black dark:text-white text-xl font-semibold mb-[10px]">
              {invoice.title || 'Untitled Invoice'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Invoice #: <span className="font-semibold">{invoice.invoice_number}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-[10px]">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="trezo-card bg-transparent pt-[20px] md:pt-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="trezo-tabs mb-[20px] md:mb-[25px]">
            <ul className="navs border-b border-gray-100 dark:border-[#172036] overflow-x-auto">
              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(0)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 0
                      ? 'text-primary-500 border-b-[3px] border-primary-500 pb-[9px]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">dashboard</i>
                  Overview
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(1)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 1
                      ? 'text-primary-500 border-b-[3px] border-primary-500 pb-[9px]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">list_alt</i>
                  Invoice Items
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 2
                      ? 'text-primary-500 border-b-[3px] border-primary-500 pb-[9px]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">percent</i>
                  Tax Items
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(3)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 3
                      ? 'text-primary-500 border-b-[3px] border-primary-500 pb-[9px]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">receipt_long</i>
                  Credit Notes
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(4)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 4
                      ? 'text-primary-500 border-b-[3px] border-primary-500 pb-[9px]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">payments</i>
                  Payments
                </button>
              </li>
            </ul>
          </div>

          {/* Overview Tab */}
          {activeTab === 0 && (
            <div className="pt-[20px]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {/* Basic Info */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Basic Information
                    </h6>

                    <div className="space-y-[15px] text-sm">
                      <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span
                          className={`inline-block px-[10px] py-[5px] rounded-full text-xs font-medium ${getStatusBadgeClass(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </div>

                      {invoice.status === 'draft' && (
                        <div className="flex justify-end pt-[10px]">
                          <button
                            type="button"
                            onClick={handleMarkAsSent}
                            disabled={markingSent}
                            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {markingSent ? 'Marking…' : 'Mark as Sent'}
                          </button>
                        </div>
                      )}

                      <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                        <span className="text-black dark:text-white font-semibold">
                          {invoice.currency}
                        </span>
                      </div>

                      <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">
                          Description:
                        </span>
                        <p className="text-black dark:text-white text-sm">
                          {invoice.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Line Items Summary */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Invoice Line Items
                    </h6>

                    {(!invoice.invoiceItems || invoice.invoiceItems.length === 0) && (
                      <p className="text-xs text-gray-500">No items on this invoice.</p>
                    )}

                    {invoice.invoiceItems && invoice.invoiceItems.length > 0 && (
                      <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md mb-[10px]">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-[#15203c]">
                            <tr>
                              <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                                Item
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Unit
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Qty
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoice.invoiceItems.map((item) => (
                              <tr
                                key={item.id}
                                className="border-b border-gray-100 dark:border-[#172036] align-middle"
                              >
                                <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px]">
                                  <div className="font-medium">{item.item_name}</div>
                                  {item.item_description && (
                                    <div className="text-xs text-gray-500">
                                      {item.item_description}
                                    </div>
                                  )}
                                </td>
                                <td className="text-sm text-right px-[15px] py-[12px]">
                                  {formatCurrency(item.item_amount, invoice.currency)}
                                </td>
                                <td className="text-sm text-right px-[15px] py-[12px]">
                                  {item.quantity ?? 1}
                                </td>
                                <td className="text-sm text-right px-[15px] py-[12px]">
                                  {formatCurrency(
                                    item.total ?? item.item_amount * (item.quantity ?? 1),
                                    invoice.currency
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Financial Summary */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Financial Summary
                    </h6>

                    <div className="space-y-[15px] text-sm">
                      <div className="flex items-center justify-between pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium">
                          {formatCurrency(invoice.subtotal_amount, invoice.currency)}
                        </span>
                      </div>

                      {invoice.tax_amount > 0 && (
                        <div className="flex items-center justify-between pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <span className="text-gray-600 dark:text-gray-400">Tax</span>
                          <span className="font-medium">
                            {formatCurrency(invoice.tax_amount, invoice.currency)}
                          </span>
                        </div>
                      )}

                      {invoice.discount_amount > 0 && (
                        <div className="flex items-center justify-between pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <span className="text-gray-600 dark:text-gray-400">Discount</span>
                          <span className="font-medium">
                            {formatCurrency(invoice.discount_amount, invoice.currency)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-[15px] border-t-2 border-gray-200 dark:border-[#172036] text-base">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold text-primary-500 text-lg">
                          {formatCurrency(invoice.total_amount, invoice.currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(invoice.payment_terms || invoice.notes_to_customer) && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Additional Information
                      </h6>

                      <div className="space-y-[15px] text-sm">
                        {invoice.payment_terms && (
                          <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                            <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">
                              Payment Terms:
                            </span>
                            <p className="text-black dark:text-white">
                              {invoice.payment_terms}
                            </p>
                          </div>
                        )}

                        {invoice.notes_to_customer && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">
                              Notes to Customer:
                            </span>
                            <p className="text-black dark:text-white">
                              {invoice.notes_to_customer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Invoice Summary */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Invoice Summary
                    </h6>

                    <div className="space-y-[10px] text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Invoice #
                        </span>
                        <span className="text-black dark:text-white font-medium">
                          {invoice.invoice_number}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Currency
                        </span>
                        <span className="text-black dark:text-white font-medium">
                          {invoice.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer */}
                  {invoice.customer && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Customer
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/customer/${invoice.customer.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {invoice.customer.name}
                            </Link>
                          </span>
                        </div>

                        {invoice.customer.email && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Email</span>
                            <span className="text-black dark:text-white">
                              {invoice.customer.email}
                            </span>
                          </div>
                        )}

                        {invoice.customer.phone && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Phone</span>
                            <span className="text-black dark:text-white">
                              {invoice.customer.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project */}
                  {invoice.project && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Project
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/project/${invoice.project.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {invoice.project.name}
                            </Link>
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Code</span>
                          <span className="text-black dark:text-white">
                            {invoice.project.code}
                          </span>
                        </div>

                        {invoice.project.status && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Status</span>
                            <span className="text-black dark:text-white capitalize">
                              {invoice.project.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Linked Order */}
                  {invoice.order && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Linked Order
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Order #
                          </span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/orders/${invoice.order.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {invoice.order.order_number}
                            </Link>
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Status</span>
                          <span className="text-black dark:text-white capitalize">
                            {invoice.order.status}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total</span>
                          <span className="text-black dark:text-white font-medium">
                            {formatCurrency(
                              invoice.order.total_amount,
                              invoice.order.currency
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Actions
                    </h6>

                    <div className="space-y-[10px]">
                      <button
                        type="button"
                        onClick={handleStartEdit}
                        className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900"
                      >
                        <i className="material-symbols-outlined mr-[8px] !text-[20px]">
                          edit
                        </i>
                        Edit Header
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        disabled={downloading}
                        className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-info-50 dark:bg-info-950 text-info-500 hover:bg-info-100 dark:hover:bg-info-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="material-symbols-outlined mr-[8px] !text-[20px]">
                          download
                        </i>
                        {downloading ? 'Downloading…' : 'Download PDF'}
                      </button>

                      <button
                        type="button"
                        onClick={handleSendEmail}
                        disabled={sendingEmail}
                        className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-success-50 dark:bg-success-950 text-success-500 hover:bg-success-100 dark:hover:bg-success-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="material-symbols-outlined mr-[8px] !text-[20px]">
                          mail
                        </i>
                        {sendingEmail ? 'Sending…' : 'Send Email'}
                      </button>

                      {(invoice.status === 'sent' || invoice.status === 'partial-paid') && (
                        <button
                          type="button"
                          onClick={handleOpenAddPayment}
                          className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-warning-50 dark:bg-warning-950 text-warning-500 hover:bg-warning-100 dark:hover:bg-warning-900"
                        >
                          <i className="material-symbols-outlined mr-[8px] !text-[20px]">payments</i>
                          Add Payment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Items Tab */}
          {activeTab === 1 && (
            <div className="pt-[20px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                  Invoice Items
                </h6>

                {(!invoice.invoiceItems || invoice.invoiceItems.length === 0) && (
                  <p className="text-xs text-gray-500">No items on this invoice.</p>
                )}

                {invoice.invoiceItems && invoice.invoiceItems.length > 0 && (
                  <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-[#15203c]">
                        <tr>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Item
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Unit
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Qty
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.invoiceItems.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 dark:border-[#172036] align-middle"
                          >
                            <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px]">
                              <div className="font-medium">{item.item_name}</div>
                              {item.item_description && (
                                <div className="text-xs text-gray-500">
                                  {item.item_description}
                                </div>
                              )}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(item.item_amount, invoice.currency)}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {item.quantity ?? 1}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(
                                item.total ?? item.item_amount * (item.quantity ?? 1),
                                invoice.currency
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tax Items Tab */}
          {activeTab === 2 && (
            <div className="pt-[20px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                  Tax Items
                </h6>

                {(!invoice.taxitems || invoice.taxitems.length === 0) && (
                  <p className="text-xs text-gray-500">No tax items on this invoice.</p>
                )}

                {invoice.taxitems && invoice.taxitems.length > 0 && (
                  <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-[#15203c]">
                        <tr>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Name
                          </th>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Type
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Value
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.taxitems.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 dark:border-[#172036] align-middle"
                          >
                            <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px]">
                              {item.item_name}
                            </td>
                            <td className="text-sm capitalize ltr:text-left rtl:text-right px-[15px] py-[12px]">
                              {item.item_type}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {item.item_value != null
                                ? item.item_type === 'percent'
                                  ? `${item.item_value.toFixed(2)}%`
                                  : formatCurrency(item.item_value, invoice.currency)
                                : '-'}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(item.item_amount ?? 0, invoice.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Credit Notes Tab */}
          {activeTab === 3 && (
            <div className="pt-[20px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                <div className="flex items-center justify-between mb-[15px]">
                  <h6 className="text-black dark:text-white font-semibold">
                    Credit Notes
                  </h6>

                  <button
                    type="button"
                    onClick={() => setIsAddingCreditNote(true)}
                    className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900"
                  >
                    <i className="material-symbols-outlined mr-[6px] !text-[20px]">add</i>
                    Add Credit Note
                  </button>
                </div>

                {(!invoice.creditnotes || invoice.creditnotes.length === 0) && (
                  <p className="text-xs text-gray-500">
                    No credit notes associated with this invoice.
                  </p>
                )}

                {invoice.creditnotes && invoice.creditnotes.length > 0 && (
                  <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-[#15203c]">
                        <tr>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Title
                          </th>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Status
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.creditnotes.map((cn) => (
                          <tr
                            key={cn.id}
                            className="border-b border-gray-100 dark:border-[#172036] align-middle"
                          >
                            <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px]">
                              <span className="font-medium">{cn.title}</span>
                            </td>
                            <td className="text-sm capitalize ltr:text-left rtl:text-right px-[15px] py-[12px]">
                              {cn.status}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(cn.total_amount, cn.currency)}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              <Link
                                href={`/cust-credit-notes/${cn.id}`}
                                className="text-primary-500 hover:underline text-xs"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 4 && (
            <div className="pt-[20px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                <div className="flex items-center justify-between mb-[15px]">
                  <h6 className="text-black dark:text-white font-semibold">
                    Payments
                  </h6>

                  {(invoice.status === 'sent' || invoice.status === 'partial-paid') && (
                    <button
                      type="button"
                      onClick={handleOpenAddPayment}
                      className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900"
                    >
                      <i className="material-symbols-outlined mr-[6px] !text-[20px]">add</i>
                      Add Payment
                    </button>
                  )}
                </div>

                {(!invoice.payments || invoice.payments.length === 0) && (
                  <p className="text-xs text-gray-500">
                    No payments recorded for this invoice.
                  </p>
                )}

                {invoice.payments && invoice.payments.length > 0 && (
                  <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-[#15203c]">
                        <tr>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Date
                          </th>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Status
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.payments.map((pmt) => (
                          <tr
                            key={pmt.id}
                            className="border-b border-gray-100 dark:border-[#172036] align-middle"
                          >
                            <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px]">
                              {pmt.payment_date
                                ? new Date(pmt.payment_date).toLocaleDateString()
                                : '-'}
                            </td>
                            <td className="text-sm capitalize ltr:text-left rtl:text-right px-[15px] py-[12px]">
                              {pmt.payment_status}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(pmt.amount_paid, pmt.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Header Panel */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">Edit Invoice Header</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Terms</label>
                <textarea
                  value={editPaymentTerms}
                  onChange={(e) => setEditPaymentTerms(e.target.value)}
                  rows={3}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes to Customer</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleSaveHeader}
                  disabled={saving}
                  className="px-3 py-2 text-sm rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="px-3 py-2 text-sm rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Add Payment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[20px]">
              <div>
                <label className="block text-xs font-medium mb-[5px]">Amount Paid</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Payment Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as 'cash' | 'mpesa' | 'bank_transfer' | 'check')
                  }
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="cash">Cash</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as 'pending' | 'complete')}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="pending">Pending</option>
                  <option value="complete">Complete</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Currency</label>
                <input
                  type="text"
                  value={paymentCurrency}
                  onChange={(e) => setPaymentCurrency(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Receipt Number</label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Bank Name (optional)</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Cheque Number (optional)</label>
                <input
                  type="text"
                  value={checkNumber}
                  onChange={(e) => setCheckNumber(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Transaction Reference (optional)</label>
                <input
                  type="text"
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Exchange Rate</label>
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Fee / Charge</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={feeOrCharge}
                  onChange={(e) => setFeeOrCharge(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => setIsAddingPayment(false)}
                disabled={savingPayment}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePayment}
                disabled={savingPayment}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPayment ? 'Saving…' : 'Save Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddingCreditNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Create Credit Note
            </h3>

            <div className="space-y-[15px] mb-[20px]">
              <div>
                <label className="block text-xs font-medium mb-[5px]">Title</label>
                <input
                  type="text"
                  value={creditNoteTitle}
                  onChange={(e) => setCreditNoteTitle(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Description (optional)</label>
                <textarea
                  value={creditNoteDescription}
                  onChange={(e) => setCreditNoteDescription(e.target.value)}
                  rows={3}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Notes to Customer (optional)</label>
                <textarea
                  value={creditNoteNotes}
                  onChange={(e) => setCreditNoteNotes(e.target.value)}
                  rows={3}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => setIsAddingCreditNote(false)}
                disabled={savingCreditNote}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCreditNote}
                disabled={savingCreditNote}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingCreditNote ? 'Creating…' : 'Create Credit Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  )
}
