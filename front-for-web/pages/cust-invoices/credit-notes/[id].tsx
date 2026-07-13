import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'
import { useToast } from '../../../hooks/useToast'
import { selectAccessToken } from '../../../store/auth/selectors'
import { ToastContainer } from '../../../components/common/Toast'
import Can from '../../../components/auth/Can'
import { currencySymbols, formatCurrency } from '../../../utils/format'

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

interface RelatedInvoiceSummary {
  id: number
  invoice_number: string
  currency: string
  title?: string | null
  total_amount?: number | null
  customer?: CustomerSummary | null
  project?: ProjectSummary | null
  order?: OrderSummary | null
}

interface CustCreditNote {
  id: number
  credit_note_number: string
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
  items: CustCreditNoteItem[]
  invoice?: RelatedInvoiceSummary | null
}

interface CustCreditNoteItem {
  id: number
  credit_note_id: number
  item_name: string
  item_description: string | null
  item_amount: number
  quantity: number
  total: number
  is_taxable: boolean
  tax_id: number | null
  tax_item_name: string | null
  item_type: 'fixed' | 'percent' | null
  item_value: number | null
  tax_amount: number
  custom_note: string | null
}

interface CustCreditNoteItemFormState {
  item_name: string
  item_description: string
  item_amount: string
  quantity: string
  is_taxable: boolean
  tax_id: string
  tax_item_name: string
  item_type: 'fixed' | 'percent'
  item_value: string
  custom_note: string
}

interface TaxSummary {
  id: number
  name: string
  code: string
  description?: string | null
  rate?: number | null
  is_default?: boolean | number | null
}

interface AccountSummary {
  id: number
  code: string
  name: string
  currency: string
}

type CreditNoteStatus = 'draft' | 'raised' | 'refunded'

const CustCreditNoteDetailPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query

  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const [creditNote, setCreditNote] = useState<CustCreditNote | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState(0)
  const [updatingStatus, setUpdatingStatus] = useState<CreditNoteStatus | null>(null)

  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CustCreditNoteItem | null>(null)
  const [itemForm, setItemForm] = useState<CustCreditNoteItemFormState>({
    item_name: '',
    item_description: '',
    item_amount: '',
    quantity: '1',
    is_taxable: false,
    tax_id: '',
    tax_item_name: '',
    item_type: 'percent',
    item_value: '',
    custom_note: '',
  })
  const [isItemSubmitting, setIsItemSubmitting] = useState(false)
  const [itemError, setItemError] = useState<string | null>(null)

  const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<CustCreditNoteItem | null>(null)
  const [isDeletingItem, setIsDeletingItem] = useState(false)
  const [deleteItemError, setDeleteItemError] = useState<string | null>(null)

  const [taxes, setTaxes] = useState<TaxSummary[]>([])
  const [loadingTaxes, setLoadingTaxes] = useState(false)
  const [taxesError, setTaxesError] = useState<string | null>(null)

  const [ledgerRows, setLedgerRows] = useState<any[]>([])
  const [accounts, setAccounts] = useState<AccountSummary[]>([])
  const [refundAccount, setRefundAccount] = useState<string>('')
  const [loadingLedger, setLoadingLedger] = useState(false)
  const [ledgerError, setLedgerError] = useState<string | null>(null)

  const [downloading, setDownloading] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)

  const [isEditingHeader, setIsEditingHeader] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [savingHeader, setSavingHeader] = useState(false)

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundDate, setRefundDate] = useState('')
  const [transactionCost, setTransactionCost] = useState('')
  const [forexRate, setForexRate] = useState('')
  const [savingRefund, setSavingRefund] = useState(false)

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

      const rawItems = Array.isArray(cn?.items) ? cn.items : []
      const rawInvoice = cn?.invoice || null

      const mapped: CustCreditNote = {
        id: cn.id,
        credit_note_number: cn.credit_note_number ?? String(cn.id ?? ''),
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
        items: (rawItems || []).map((it: any): CustCreditNoteItem => ({
          id: Number(it.id),
          credit_note_id: Number(it.credit_note_id),
          item_name: it.item_name || '',
          item_description: it.item_description ?? '',
          item_amount: Number(it.item_amount ?? 0),
          quantity: Number(it.quantity ?? 1),
          total: Number(it.total ?? 0),
          is_taxable: Boolean(it.is_taxable),
          tax_id: it.tax_id ?? null,
          tax_item_name: it.tax_item_name ?? null,
          item_type: (it.item_type as 'fixed' | 'percent' | null) ?? null,
          item_value: it.item_value !== undefined && it.item_value !== null ? Number(it.item_value) : null,
          tax_amount: it.tax_amount !== undefined && it.tax_amount !== null ? Number(it.tax_amount) : 0,
          custom_note: it.custom_note ?? null,
        })),
        invoice: rawInvoice
          ? {
              id: Number(rawInvoice.id),
              invoice_number: String(rawInvoice.invoice_number ?? rawInvoice.id ?? ''),
              currency: String(rawInvoice.currency ?? cn.currency ?? 'USD'),
              title: rawInvoice.title ?? null,
              total_amount:
                rawInvoice.total_amount !== undefined && rawInvoice.total_amount !== null
                  ? Number(rawInvoice.total_amount)
                  : null,
              customer: rawInvoice.customer
                ? {
                    id: Number(rawInvoice.customer.id),
                    name: String(rawInvoice.customer.name ?? ''),
                    email: rawInvoice.customer.email ?? null,
                    phone: rawInvoice.customer.phone ?? null,
                  }
                : null,
              project: rawInvoice.project
                ? {
                    id: Number(rawInvoice.project.id),
                    code: String(rawInvoice.project.code ?? ''),
                    name: String(rawInvoice.project.name ?? ''),
                    status: rawInvoice.project.status ?? null,
                  }
                : null,
              order: rawInvoice.order
                ? {
                    id: Number(rawInvoice.order.id),
                    order_number: String(rawInvoice.order.order_number ?? ''),
                    status: String(rawInvoice.order.status ?? ''),
                    total_amount: Number(rawInvoice.order.total_amount ?? 0),
                    currency: String(rawInvoice.order.currency ?? rawInvoice.currency ?? 'USD'),
                  }
                : null,
            }
          : null,
      }

      setCreditNote(mapped)
    } catch (e: any) {
      addToast(e?.message || 'Failed to load customer credit note', 'error')
      setCreditNote(null)
    } finally {
      setLoading(false)
    }
  }

  const loadTaxes = async () => {
    if (!accessToken) return

    setLoadingTaxes(true)
    setTaxesError(null)

    try {
      const resp = await fetch('/api/taxes/list?per_page=1000', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        const message = data?.message || 'Failed to load taxes'
        setTaxesError(message)
        addToast(message, 'error')
        return
      }

      const list = (data?.data || data) as TaxSummary[]
      setTaxes(Array.isArray(list) ? list : [])
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      // eslint-disable-next-line no-console
      console.error('fetch taxes error', err)
      setTaxesError('Error loading taxes')
    } finally {
      setLoadingTaxes(false)
    }
  }

  const loadAccounts = async () => {
    if (!accessToken) return

    try {
      const resp = await fetch('/api/accounts/list?per_page=1000', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        const message = data?.message || 'Failed to load accounts'
        addToast(message, 'error')
        return
      }

      const list = (data?.data || data) as any[]
      const mapped: AccountSummary[] = (Array.isArray(list) ? list : []).map((acc: any) => ({
        id: Number(acc.id),
        code: String(acc.code ?? ''),
        name: String(acc.name ?? ''),
        currency: String(acc.currency ?? ''),
      }))
      setAccounts(mapped)
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('fetch accounts error', err)
      addToast('Error loading accounts', 'error')
    }
  }

  const loadLedgerForCreditNote = async (note: CustCreditNote | null) => {
    if (!note || !accessToken) return

    setLoadingLedger(true)
    setLedgerError(null)

    try {
      const params = new URLSearchParams()
      params.append('page', '1')
      params.append('per_page', '50')
      params.append('source_type', 'customer_credit_note')
      params.append('source_id', String(note.id))

      const resp = await fetch(`/api/finance/customer-ledger/list?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        const message = data?.message || 'Failed to load related transactions'
        setLedgerError(message)
        addToast(message, 'error')
        setLedgerRows([])
        return
      }

      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      setLedgerRows(items || [])
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      // eslint-disable-next-line no-console
      console.error('fetch credit note ledger error', err)
      setLedgerError('Error loading related transactions')
      setLedgerRows([])
    } finally {
      setLoadingLedger(false)
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

  const handleStartEditHeader = () => {
    if (!creditNote) return

    setEditTitle(creditNote.title || '')
    setEditDescription(creditNote.description || '')
    setEditNotes(creditNote.notes_to_customer || '')
    setIsEditingHeader(true)
  }

  const handleSaveHeader = async () => {
    if (!creditNote || !accessToken) return

    setSavingHeader(true)
    try {
      const resp = await fetch(`/api/cust-credit-notes/${creditNote.id}` as string, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: editTitle || null,
          description: editDescription || null,
          notes_to_customer: editNotes || null,
        }),
      })

      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to update credit note')
      }

      addToast(data?.message || 'Credit note updated successfully', 'success')
      setIsEditingHeader(false)
      await fetchCreditNote()
    } catch (e: any) {
      addToast(e?.message || 'Failed to update credit note', 'error')
    } finally {
      setSavingHeader(false)
    }
  }

  const handleSendEmail = async () => {
    if (!creditNote || !accessToken) return
    setSendingEmail(true)
    try {
      const resp = await fetch(`/api/cust-credit-notes/${creditNote.id}/send-email`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to send credit note email')
      }
      addToast(data?.message || 'Credit note emailed to customer successfully', 'success')
    } catch (e: any) {
      addToast(e?.message || 'Failed to send credit note email', 'error')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!creditNote || !accessToken) return
    setDownloading(true)
    try {
      const resp = await fetch(`/api/cust-credit-notes/${creditNote.id}/download-pdf`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (!resp.ok) {
        const data: any = await resp.json().catch(() => null)
        throw new Error(data?.message || 'Failed to download credit note PDF')
      }
      const blob = await resp.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `credit-note-${creditNote.credit_note_number}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      addToast('Credit note PDF downloaded', 'success')
    } catch (e: any) {
      addToast(e?.message || 'Failed to download credit note PDF', 'error')
    } finally {
      setDownloading(false)
    }
  }

  const handleOpenRefundModal = () => {
    if (!creditNote) return

    setRefundAmount(String(creditNote.total_amount || 0))
    setRefundDate(new Date().toISOString().slice(0, 10))
    setTransactionCost('')
    setForexRate('')
    setIsRefundModalOpen(true)
  }

  const handleSaveRefund = async () => {
    if (!creditNote || !accessToken) return

    if (!refundAmount || Number(refundAmount) <= 0) {
      addToast('Please enter a valid refund amount.', 'error')
      return
    }

    if (!refundDate) {
      addToast('Please select a refund date.', 'error')
      return
    }

    if (!refundAccount) {
      addToast('Please select the financing account for this refund.', 'error')
      return
    }

    const transactionCostNum = transactionCost ? Number(transactionCost) : 0
    const forexRateNum = forexRate ? Number(forexRate) : 1

    // Validate forex_rate: must be 0 or greater than 100
    if (forexRateNum !== 0 && forexRateNum <= 100) {
      addToast('Forex rate must be either 0 or greater than 100.', 'error')
      return
    }

    // If transaction_cost is greater than 1, forex_rate cannot be 0
    if (transactionCostNum > 1 && forexRateNum === 0) {
      addToast('Forex rate cannot be zero when transaction cost is greater than 1.', 'error')
      return
    }

    setSavingRefund(true)
    try {
      const resp = await fetch(`/api/cust-credit-notes/${creditNote.id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: Number(refundAmount),
          date: refundDate,
          financing_account: refundAccount,
          transaction_cost: transactionCost ? Number(transactionCost) : 0,
          forex_rate: forexRate ? Number(forexRate) : 1,
        }),
      })

      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        const message = data?.message || 'Failed to record refund'
        addToast(message, 'error')
        return
      }

      addToast(data?.message || 'Refund recorded successfully', 'success')
      setIsRefundModalOpen(false)
      await fetchCreditNote()
      await loadLedgerForCreditNote({ ...creditNote, id: creditNote.id } as any)
    } catch (e: any) {
      addToast(e?.message || 'Failed to record refund', 'error')
    } finally {
      setSavingRefund(false)
    }
  }

  useEffect(() => {
    if (!id || !accessToken) return
    fetchCreditNote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken])

  useEffect(() => {
    if (!accessToken) return
    loadTaxes()
    loadAccounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  useEffect(() => {
    if (!creditNote || !accessToken) return
    loadLedgerForCreditNote(creditNote)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditNote?.id, accessToken])

  
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

  const handleOpenAddItemModal = () => {
    setEditingItem(null)
    setItemError(null)
    setItemForm({
      item_name: '',
      item_description: '',
      item_amount: '',
      quantity: '1',
      is_taxable: false,
      tax_id: '',
      tax_item_name: '',
      item_type: 'percent',
      item_value: '',
      custom_note: '',
    })
    setIsItemModalOpen(true)
  }

  const handleOpenEditItemModal = (item: CustCreditNoteItem) => {
    setEditingItem(item)
    setItemError(null)
    setItemForm({
      item_name: item.item_name || '',
      item_description: item.item_description || '',
      item_amount:
        item.item_amount !== undefined && item.item_amount !== null
          ? String(item.item_amount)
          : '',
      quantity: item.quantity != null ? String(item.quantity) : '1',
      is_taxable: !!item.is_taxable,
      tax_id: item.tax_id != null ? String(item.tax_id) : '',
      tax_item_name: item.tax_item_name || '',
      item_type: item.item_type || 'percent',
      item_value:
        item.item_value !== undefined && item.item_value !== null
          ? String(item.item_value)
          : '',
      custom_note: item.custom_note || '',
    })
    setIsItemModalOpen(true)
  }

  const handleCloseItemModal = () => {
    if (isItemSubmitting) return
    setIsItemModalOpen(false)
    setEditingItem(null)
    setItemError(null)
  }

  const handleItemFormChange = (field: keyof CustCreditNoteItemFormState, value: any) => {
    setItemForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!creditNote) return

    if (!itemForm.item_name || !itemForm.item_amount || !itemForm.custom_note) {
      setItemError('Item name, amount, and custom note are required.')
      return
    }

    setIsItemSubmitting(true)
    setItemError(null)

    try {
      const payload: any = {
        credit_note_id: creditNote.id,
        item_name: itemForm.item_name.trim(),
        item_description: itemForm.item_description?.trim() || '',
        item_amount: Number(itemForm.item_amount || 0),
        quantity: Number(itemForm.quantity || 1),
        is_taxable: Boolean(itemForm.is_taxable),
        custom_note: itemForm.custom_note.trim(),
      }

      if (itemForm.is_taxable) {
        payload.tax_id = itemForm.tax_id ? Number(itemForm.tax_id) : null
        payload.tax_item_name = itemForm.tax_item_name || null
        payload.item_type = itemForm.item_type || null
        payload.item_value = itemForm.item_value ? Number(itemForm.item_value) : null
      } else {
        payload.tax_id = null
        payload.tax_item_name = null
        payload.item_type = null
        payload.item_value = null
      }

      const isEditing = !!editingItem
      const url = isEditing
        ? `/api/cust-credit-note-items/update?id=${editingItem?.id}`
        : '/api/cust-credit-note-items/create'

      const resp = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        const message = data?.message || 'Failed to save line item'
        setItemError(message)
        addToast(message, 'error')
        return
      }

      addToast(
        isEditing ? 'Line item updated successfully' : 'Line item added successfully',
        'success',
      )
      handleCloseItemModal()
      await fetchCreditNote()
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error saving credit note item:', err)
      setItemError('Unexpected error while saving line item.')
      addToast('Error saving line item', 'error')
    } finally {
      setIsItemSubmitting(false)
    }
  }

  const openDeleteItemModal = (item: CustCreditNoteItem) => {
    setDeleteItem(item)
    setDeleteItemError(null)
    setDeleteItemModalOpen(true)
  }

  const closeDeleteItemModal = () => {
    if (isDeletingItem) return
    setDeleteItemModalOpen(false)
    setDeleteItem(null)
    setDeleteItemError(null)
  }

  const handleConfirmDeleteItem = async () => {
    if (!deleteItem) return

    setIsDeletingItem(true)
    setDeleteItemError(null)

    try {
      const resp = await fetch(`/api/cust-credit-note-items/delete?id=${deleteItem.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!resp.ok) {
        const data: any = await resp.json().catch(() => null)
        const message = data?.message || 'Failed to delete line item'
        setDeleteItemError(message)
        addToast(message, 'error')
        return
      }

      addToast('Line item deleted successfully', 'success')
      closeDeleteItemModal()
      await fetchCreditNote()
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error deleting credit note item:', err)
      setDeleteItemError('Unexpected error while deleting line item.')
      addToast('Error deleting line item', 'error')
    } finally {
      setIsDeletingItem(false)
    }
  }

  const itemsSubtotal = useMemo(() => {
    if (!creditNote?.items?.length) return 0
    return creditNote.items.reduce((sum, item) => sum + (item.total || 0), 0)
  }, [creditNote?.items])

  const itemsTaxTotal = useMemo(() => {
    if (!creditNote?.items?.length) return 0
    return creditNote.items.reduce((sum, item) => sum + (item.tax_amount || 0), 0)
  }, [creditNote?.items])

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
            href="/cust-invoices/invoice-list"
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[24px] py-[11px] bg-primary-500 text-white hover:bg-primary-600"
          >
            Back to Customer Invoices
          </Link>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!creditNote) return null

  const normalizedStatus = creditNote.status?.toLowerCase() as any
  const isDraft = normalizedStatus === 'draft'
  const isRaised = normalizedStatus === 'raised'
  const isRefunded = normalizedStatus === 'refunded'

  return (
    <AuthenticatedLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-1">Customer Credit Note</h5>
          <p className="text-sm text-gray-500">
            Credit Note #{creditNote.credit_note_number || creditNote.id}
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
            Credit Note #{creditNote.credit_note_number || creditNote.id}
          </li>
        </ol>
      </div>

      {/* Header Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[20px]">
          <div>
            <h4 className="text-black dark:text-white text-xl font-semibold mb-[10px]">
              {creditNote.title || 'Untitled Credit Note'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Credit Note #: <span className="font-semibold">{creditNote.credit_note_number || creditNote.id}</span>
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
                  Line Items
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
                  <i className="material-symbols-outlined !text-[20px]">payments</i>
                  Transactions
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
                            creditNote.status,
                          )}`}
                        >
                          {creditNote.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                        <span className="text-black dark:text-white font-semibold">
                          {creditNote.currency}
                        </span>
                      </div>

                      <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">
                          Description:
                        </span>
                        <p className="text-black dark:text-white text-sm">
                          {creditNote.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Credit Note Line Items Summary */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <div className="flex items-center justify-between mb-[10px]">
                      <h6 className="text-black dark:text-white font-semibold">
                        Credit Note Line Items
                      </h6>
                    </div>

                    {(!creditNote.items || creditNote.items.length === 0) && (
                      <p className="text-xs text-gray-500">No items on this credit note.</p>
                    )}

                    {creditNote.items && creditNote.items.length > 0 && (
                      <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md mb-[10px]">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-[#15203c]">
                            <tr>
                              <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                                Item
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Qty
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Unit Price({ currencySymbols[creditNote.currency]})
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Tax({ currencySymbols[creditNote.currency]})
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Line Total({ currencySymbols[creditNote.currency]})
                              </th>
                            {isDraft && (
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">Actions</th>
                            )}
                            </tr>
                          </thead>
                          <tbody>
                            {creditNote.items.map((item) => (
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
                                  {item.custom_note && (
                                    <div className="mt-[2px] text-[11px] text-gray-500 dark:text-gray-400 italic">
                                      {item.custom_note}
                                    </div>
                                  )}
                                </td>
                                <td className="text-sm text-right px-[15px] py-[12px]">
                                  {item.quantity}
                                </td>
                                <td className="text-sm text-right px-[15px] py-[12px]">
                                  {formatCurrency(item.item_amount, '')}
                                </td>
                                <td className="text-sm text-right px-[15px] py-[12px]">
                                  {item.is_taxable
                                    ? formatCurrency(item.tax_amount, '')
                                    : 'Not taxable'}
                                </td>
                                <td className="text-sm text-right px-[15px] py-[12px]">
                                  {formatCurrency(item.total + (item.tax_amount || 0), '')}
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
                          {formatCurrency(creditNote.subtotal_amount, creditNote.currency)}
                        </span>
                      </div>

                      {creditNote.tax_amount > 0 && (
                        <div className="flex items-center justify-between pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <span className="text-gray-600 dark:text-gray-400">Tax</span>
                          <span className="font-medium">
                            {formatCurrency(creditNote.tax_amount, creditNote.currency)}
                          </span>
                        </div>
                      )}

                      {/* Refund/Transaction Section */}
                      {ledgerRows && ledgerRows.length > 0 && (
                        <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <div className="flex items-center justify-between mb-[5px]">
                            <span className="text-gray-600 dark:text-gray-400">Refund Transactions</span>
                            <span className="font-medium">{ledgerRows.filter((row) => row.transaction_type === 'refund').length}</span>
                          </div>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            {ledgerRows
                              .filter((row) => row.transaction_type === 'refund')
                              .map((row) => (
                                <li key={row.id} className="flex justify-between">
                                  <span>
                                    {row.transaction_date ? new Date(row.transaction_date).toLocaleDateString() : ''}
                                    {row.narration ? ` - ${row.narration}` : ''}
                                  </span>
                                  <span className="font-medium text-success-600 dark:text-success-400">
                                    {formatCurrency(row.amount, row.transaction_currency || creditNote.currency)}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-[15px] border-t-2 border-gray-200 dark:border-[#172036] text-base">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold text-primary-500 text-lg">
                          {formatCurrency(creditNote.total_amount, creditNote.currency)}
                        </span>
                      </div>

                      {/* Show balance as total minus sum of refund transactions */}
                      <div className="flex items-center justify-between pt-[10px]">
                        <span className="font-semibold">Balance</span>
                        <span className="font-semibold text-success-600 dark:text-success-400">
                          {formatCurrency(
                            creditNote.total_amount -
                              (ledgerRows && ledgerRows.length > 0
                                ? ledgerRows
                                    .filter((row) => row.transaction_type === 'refund')
                                    .reduce((sum, row) => sum + (Number(row.amount) || 0), 0)
                                : 0),
                            creditNote.currency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {creditNote.notes_to_customer && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Additional Information
                      </h6>

                      <div className="space-y-[15px] text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">
                            Notes to Customer:
                          </span>
                          <p className="text-black dark:text-white">
                            {creditNote.notes_to_customer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Credit Note Summary */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Credit Note Summary
                    </h6>

                    <div className="space-y-[10px] text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Credit Note #</span>
                        <span className="text-black dark:text-white font-medium">
                          {creditNote.credit_note_number || creditNote.id}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Currency</span>
                        <span className="text-black dark:text-white font-medium">
                          {creditNote.currency}
                        </span>
                      </div>

                      {creditNote.invoice && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Invoice #</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/cust-invoices/${creditNote.invoice.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {creditNote.invoice.invoice_number}
                            </Link>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Related Invoice Summary */}
                  {creditNote.invoice && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Related Invoice Summary
                      </h6>

                      <div className="space-y-[10px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Invoice: </span>
                          <span className="text-black dark:text-white font-medium w-64">
                            <Link
                              href={`/cust-invoices/${creditNote.invoice.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {creditNote.invoice.title || creditNote.invoice.invoice_number}
                            </Link>
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Amount: </span>
                          <span className="text-black dark:text-white font-medium">
                            {formatCurrency(
                              (creditNote.invoice.total_amount ?? creditNote.total_amount) || 0,
                              creditNote.invoice.currency,
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Currency: </span>
                          <span className="text-black dark:text-white font-medium">
                            {creditNote.invoice.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer */}
                  {creditNote.invoice?.customer && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Customer
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/customer/${creditNote.invoice.customer.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {creditNote.invoice.customer.name}
                            </Link>
                          </span>
                        </div>

                        {creditNote.invoice.customer.email && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Email</span>
                            <span className="text-black dark:text-white">
                              {creditNote.invoice.customer.email}
                            </span>
                          </div>
                        )}

                        {creditNote.invoice.customer.phone && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Phone</span>
                            <span className="text-black dark:text-white">
                              {creditNote.invoice.customer.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project */}
                  {creditNote.invoice?.project && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Project
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/project/${creditNote.invoice.project.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {creditNote.invoice.project.name}
                            </Link>
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Code</span>
                          <span className="text-black dark:text-white">
                            {creditNote.invoice.project.code}
                          </span>
                        </div>

                        {creditNote.invoice.project.status && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Status</span>
                            <span className="text-black dark:text-white capitalize">
                              {creditNote.invoice.project.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Linked Order */}
                  {creditNote.invoice?.order && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Linked Order
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Order #</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/orders/${creditNote.invoice.order.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {creditNote.invoice.order.order_number}
                            </Link>
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Status</span>
                          <span className="text-black dark:text-white capitalize">
                            {creditNote.invoice.order.status}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total</span>
                          <span className="text-black dark:text-white font-medium">
                            {formatCurrency(
                              creditNote.invoice.order.total_amount,
                              creditNote.invoice.order.currency,
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
                      <div className="flex flex-wrap gap-[8px]">
                        <button
                          type="button"
                          onClick={() => updateStatus('draft')}
                          disabled={
                            updatingStatus !== null ||
                            !isRaised ||
                            (ledgerRows && ledgerRows.length > 0)
                          }
                          className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[10px] py-[6px] text-xs border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Mark Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus('raised')}
                          disabled={updatingStatus !== null || !isDraft}
                          className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[10px] py-[6px] text-xs border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Mark Raised
                        </button>
                      </div>

                      <Can any={['ROLE_EDIT_CUST_CREDIT_NOTE']}>
                        <button
                          type="button"
                          onClick={handleStartEditHeader}
                          className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900"
                        >
                          <i className="material-symbols-outlined mr-[8px] !text-[20px]">edit</i>
                          Edit Credit Note Header
                        </button>
                      </Can>

                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        disabled={downloading}
                        className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-info-50 dark:bg-info-950 text-info-500 hover:bg-info-100 dark:hover:bg-info-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="material-symbols-outlined mr-[8px] !text-[20px]">download</i>
                        {downloading ? 'Downloading…' : 'Download PDF'}
                      </button>

                      <button
                        type="button"
                        onClick={handleSendEmail}
                        disabled={sendingEmail}
                        className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-success-50 dark:bg-success-950 text-success-500 hover:bg-success-100 dark:hover:bg-success-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="material-symbols-outlined mr-[8px] !text-[20px]">mail</i>
                        {sendingEmail ? 'Sending…' : 'Send Email'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Line Items Tab */}
          {activeTab === 1 && (
            <div className="pt-[20px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                <div className="flex items-center justify-between mb-[15px]">
                  <h6 className="text-black dark:text-white font-semibold">
                    Credit Note Line Items
                  </h6>
                  <div className="text-right">
                    <Can any={['ROLE_ADD_CUST_CREDIT_NOTE_ITEM']}>
                      <button
                        type="button"
                        onClick={handleOpenAddItemModal}
                        disabled={!isDraft}
                        className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="material-symbols-outlined mr-[6px] !text-[18px]">add</i>
                        Add Line Item
                      </button>
                    </Can>
                    {!isDraft && (
                      <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                        Line items can only be added when the credit note status is
                        {' '}
                        <span className="font-medium">draft</span>.
                      </p>
                    )}
                  </div>
                </div>

                {(!creditNote.items || creditNote.items.length === 0) && (
                  <p className="text-xs text-gray-500">No items on this credit note.</p>
                )}

                {creditNote.items && creditNote.items.length > 0 && (
                  <div className="table-responsive overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-[#15203c]">
                        <tr>
                          <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                            Item
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Qty
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Unit Price({currencySymbols[creditNote.currency]})
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Tax({currencySymbols[creditNote.currency]})
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Line Total({currencySymbols[creditNote.currency]})
                          </th>
                          {isDraft && (
                            <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {creditNote.items.map((item) => (
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
                              {item.custom_note && (
                                <div className="mt-[2px] text-[11px] text-gray-500 dark:text-gray-400 italic">
                                  {item.custom_note}
                                </div>
                              )}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {item.quantity}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(item.item_amount, '')}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {item.is_taxable
                                ? formatCurrency(item.tax_amount, '')
                                : 'Not taxable'}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(item.total + (item.tax_amount || 0), '')}
                            </td>
                            {isDraft && (
                              <td className="text-sm text-right px-[15px] py-[12px] whitespace-nowrap">
                                <button
                                  type="button"
                                  className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:underline mr-2"
                                  onClick={() => handleOpenEditItemModal(item)}
                                  disabled={isItemSubmitting}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex items-center px-2 py-1 text-xs text-red-600 hover:underline"
                                  onClick={() => openDeleteItemModal(item)}
                                  disabled={isItemSubmitting}
                                >
                                  Delete
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-[16px] pt-[20px]">
              <div className="flex items-center justify-between">
                <div>
                  <h6 className="text-sm font-semibold text-black dark:text.white">
                    Related Transactions
                  </h6>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Customer ledger entries linked to this credit note.
                  </p>
                </div>
                <div className="text-right">
                  <Can any={['ROLE_ADD_CUST_PAYMENT']}>
                    <button
                      type="button"
                      onClick={handleOpenRefundModal}
                      disabled={!isRaised}
                      className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-warning-100 dark:bg-warning-950 text-warning-700 hover:bg-warning-100 dark:hover:bg-warning-900 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="material-symbols-outlined mr-[6px] !text-[18px]">undo</i>
                      Refund Credit Note
                    </button>
                  </Can>
                  {!isRaised && (
                    <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                      Can only refund
                      {' '}
                      <span className="font-medium">raised</span> credit notes.
                    </p>
                  )}
                </div>
              </div>

              {ledgerError && (
                <div className="mb-[10px] p-[10px] rounded-md bg-danger-50 dark:bg-[#2a1a1a] border border-danger-200 dark:border-danger-900 text-xs text-danger-700 dark:text-danger-300">
                  {ledgerError}
                </div>
              )}

              <div className="trezo-card bg-white dark:bg-[#0c1427] border border-gray-100 dark:border-[#172036] rounded-md overflow-hidden">
                {loadingLedger ? (
                  <div className="p-[20px]">
                    <div className="space-y-[10px]">
                      {[...Array(4)].map((_, idx) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div
                          key={idx}
                          className="h-[40px] bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive overflow-x-auto">
                    <table className="w-full text-xs md:text-sm">
                      <thead className="text-black dark:text-white">
                        <tr>
                          <th className="font-medium ltr:text-left rtl:text-right px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                            Transaction #
                          </th>
                          <th className="font-medium ltr:text-left rtl:text-right px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                            Type
                          </th>
                          <th className="font-medium ltr:text-left rtl:text-right px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                            Date
                          </th>
                          <th className="font-medium ltr:text-right rtl:text-left px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                            Amount
                          </th>
                          <th className="font-medium ltr:text-right rtl:text-left px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-black dark:text-white">
                        {ledgerRows && ledgerRows.length > 0 ? (
                          ledgerRows.map((row: any) => (
                            <tr
                              key={row.id}
                              className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                            >
                              <td className="px-[16px] py-[10px] whitespace-nowrap">
                                {row.transaction_number || `#${row.id}`}
                              </td>
                              <td className="px-[16px] py-[10px] whitespace-nowrap capitalize">
                                {row.transaction_type || '-'}
                              </td>
                              <td className="px-[16px] py-[10px] whitespace-nowrap">
                                {row.posted_date || row.transaction_date || '-'}
                              </td>
                              <td className="px-[16px] py-[10px] whitespace-nowrap text-right font-semibold">
                                {formatCurrency(Number(row.amount ?? 0), creditNote?.currency || 'USD')}
                              </td>
                              <td className="px-[16px] py-[10px] whitespace-nowrap text-right capitalize">
                                {row.transaction_status || '-'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center px-[16px] py-[30px] text-gray-500 dark:text-gray-400"
                            >
                              No related transactions found for this credit note
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] w-[90%] max-w-[700px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-[15px]">
              <h6 className="font-semibold text-black dark:text-white">
                {editingItem ? 'Edit Line Item' : 'Add Line Item'}
              </h6>
              {isItemSubmitting && (
                <div className="flex items-center gap-[8px]">
                  <div className="w-[16px] h-[16px] border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Saving...</span>
                </div>
              )}
            </div>

            {itemError && (
              <div className="mb-[15px] p-[10px] rounded-md bg-danger-50 dark:bg-[#2a1a1a] border border-danger-200 dark:border-danger-900">
                <p className="text-xs text-danger-700 dark:text-danger-300 whitespace-pre-wrap">{itemError}</p>
              </div>
            )}

            <form onSubmit={handleSubmitItem} className="space-y-[16px]">
              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block text-sm">
                  Item Name <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  value={itemForm.item_name}
                  onChange={(e) => handleItemFormChange('item_name', e.target.value)}
                  disabled={isItemSubmitting}
                  className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="E.g. Credit for phase"
                />
              </div>

              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block text-sm">
                  Description
                </label>
                <textarea
                  value={itemForm.item_description}
                  onChange={(e) => handleItemFormChange('item_description', e.target.value)}
                  disabled={isItemSubmitting}
                  className="min-h-[70px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] py-[8px] block w-full outline-0 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Optional description for this item"
                />
              </div>

              <div className="sm:grid sm:grid-cols-2 sm:gap-[12px]">
                <div>
                  <label className="mb-[8px] text-black dark:text-white font-medium block text-sm">
                    Amount <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={itemForm.item_amount}
                    onChange={(e) => handleItemFormChange('item_amount', e.target.value)}
                    disabled={isItemSubmitting}
                    className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="mb-[8px] text-black dark:text-white font-medium block text-sm">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={itemForm.quantity}
                    onChange={(e) => handleItemFormChange('quantity', e.target.value)}
                    disabled={isItemSubmitting}
                    className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="mb-[8px] text-black dark:text-white font-medium block text-sm">
                  Custom Note <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  value={itemForm.custom_note}
                  onChange={(e) => handleItemFormChange('custom_note', e.target.value)}
                  disabled={isItemSubmitting}
                  className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Short internal note for this line"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-[8px] text-black dark:text-white font-medium text-sm">
                  <input
                    type="checkbox"
                    checked={itemForm.is_taxable}
                    onChange={(e) => {
                      const checked = e.target.checked
                      if (!checked) {
                        setItemForm((prev) => ({
                          ...prev,
                          is_taxable: false,
                          tax_id: '',
                          tax_item_name: '',
                          item_type: 'percent',
                          item_value: '',
                        }))
                        return
                      }

                      const defaultTax =
                        taxes.find((t) => t.is_default === true || t.is_default === 1) || null

                      if (defaultTax) {
                        setItemForm((prev) => ({
                          ...prev,
                          is_taxable: true,
                          tax_id: String(defaultTax.id),
                          tax_item_name: defaultTax.name ?? '',
                          item_type: 'percent',
                          item_value:
                            defaultTax.rate != null ? String(defaultTax.rate) : prev.item_value,
                        }))
                      } else {
                        setItemForm((prev) => ({
                          ...prev,
                          is_taxable: true,
                          item_type: 'percent',
                        }))
                      }
                    }}
                    disabled={isItemSubmitting}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span>Is Taxable</span>
                </label>
              </div>

              {itemForm.is_taxable && (
                <div className="mt-[10px] border border-primary-100 dark:border-primary-900 rounded-md p-[12px] bg-primary-50/40 dark:bg-primary-900/10 space-y-[10px]">
                  <div className="sm:grid sm:grid-cols-2 sm:gap-[12px]">
                    <div>
                      <label className="mb-[8px] text-black dark:text-white font-medium block text-sm">
                        Tax Name <span className="text-danger-500">*</span>
                      </label>
                      <select
                        value={itemForm.tax_id}
                        onChange={(e) => {
                          const value = e.target.value
                          const selectedTax = taxes.find((t) => String(t.id) === value) || null
                          setItemForm((prev) => ({
                            ...prev,
                            tax_id: value,
                            tax_item_name: selectedTax ? selectedTax.name : '',
                            item_value:
                              selectedTax && selectedTax.rate != null
                                ? String(selectedTax.rate)
                                : prev.item_value,
                          }))
                        }}
                        disabled={isItemSubmitting || loadingTaxes || taxes.length === 0}
                        required
                        className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>
                          {loadingTaxes
                            ? 'Loading taxes...'
                            : taxes.length === 0
                            ? 'No taxes configured'
                            : 'Select tax'}
                        </option>
                        {taxes.map((tax) => (
                          <option key={tax.id} value={tax.id}>
                            {tax.name}
                          </option>
                        ))}
                      </select>
                      {taxesError && (
                        <p className="mt-[4px] text-[11px] text-danger-500">{taxesError}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-[8px] text-black dark:text-white font-medium block text-sm">
                        Type <span className="text-danger-500">*</span>
                      </label>
                      <select
                        value={itemForm.item_type}
                        onChange={(e) =>
                          setItemForm((prev) => ({
                            ...prev,
                            item_type: e.target.value as 'fixed' | 'percent',
                          }))
                        }
                        disabled={isItemSubmitting}
                        required
                        className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="percent">Percentage</option>
                        <option value="fixed" disabled>
                          Fixed Amount
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-[8px] text-black dark:text-white font-medium block text-sm">
                      Value
                      <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400 ml-[6px]">
                        {itemForm.item_type === 'percent'
                          ? 'as % of line total'
                          : creditNote
                          ? `in ${creditNote.currency}`
                          : ''}
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemForm.item_value}
                      onChange={(e) =>
                        setItemForm((prev) => ({
                          ...prev,
                          item_value: e.target.value,
                        }))
                      }
                      disabled={isItemSubmitting}
                      required
                      className="h-[40px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={itemForm.item_type === 'percent' ? '0.00' : '0.00'}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-[10px] mt-[10px]">
                <button
                  type="button"
                  onClick={handleCloseItemModal}
                  disabled={isItemSubmitting}
                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[12px] py-[7px] text-xs text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isItemSubmitting}
                  className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[12px] py-[7px] text-xs bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteItemModalOpen && deleteItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] w-full max-w-md">
            <div className="mb-[12px]">
              <h6 className="font-semibold text-black dark:text-white mb-[4px]">Delete Line Item</h6>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Are you sure you want to delete the line item "{deleteItem.item_name}" from this
                credit note?
              </p>
            </div>

            {deleteItemError && (
              <div className="mb-[10px] p-[8px] rounded-md bg-danger-50 dark:bg-[#2a1a1a] border border-danger-200 dark:border-danger-900">
                <p className="text-[11px] text-danger-700 dark:text-danger-300">{deleteItemError}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-[10px] mt-[10px]">
              <button
                type="button"
                onClick={closeDeleteItemModal}
                disabled={isDeletingItem}
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[12px] py-[7px] text-xs text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteItem}
                disabled={isDeletingItem}
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[12px] py-[7px] text-xs bg-danger-500 text-white hover:bg-danger-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingItem ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingHeader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[25px] w-[90%] max-w-[600px] max-height-[90vh] max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-[15px] text-black dark:text-white">
              Edit Credit Note Header
            </h2>

            <div className="space-y-[15px] mb-[20px]">
              <div>
                <label className="block text-sm font-medium mb-[5px] text-black dark:text-white">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-[5px] text-black dark:text-white">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-[5px] text-black dark:text-white">
                  Notes / Terms for Customer
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                  This maps to the credit note's notes to customer field.
                </p>
              </div>

              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                Currency, related invoice, and financial amounts are fixed and cannot be edited here.
              </div>
            </div>

            <div className="flex gap-[10px] justify-end">
              <button
                type="button"
                onClick={() => setIsEditingHeader(false)}
                disabled={savingHeader}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <Can any={['ROLE_EDIT_CUST_CREDIT_NOTE']}>
                <button
                  type="button"
                  onClick={handleSaveHeader}
                  disabled={savingHeader}
                  className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingHeader ? 'Saving…' : 'Save Changes'}
                </button>
              </Can>
            </div>
          </div>
        </div>
      )}

      {isRefundModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-[15px]">
              <h6 className="font-semibold text-black dark:text-white">Refund Credit Note</h6>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-[15px]">
              Record a refund against this credit note. This will eventually create a customer ledger entry similar to receiving a payment on an invoice.
            </p>

            <div className="space-y-[12px] mb-[20px]">
              <div>
                <label className="block text-xs font-medium mb-[5px]">Refund Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={refundAmount}
                  readOnly
                  tabIndex={-1}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 focus:outline-none cursor-not-allowed"
                />
                <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                  Credit note total: {formatCurrency(creditNote.total_amount, creditNote.currency)}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Refund Date</label>
                <input
                  type="date"
                  value={refundDate}
                  onChange={(e) => setRefundDate(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Financing Account</label>
                <select
                  value={refundAccount}
                  onChange={(e) => setRefundAccount(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Select account</option>
                  {accounts
                    .filter((acc) =>
                      creditNote ? String(acc.currency) === String(creditNote.currency) : true,
                    )
                    .map((acc) => (
                      <option key={acc.id} value={String(acc.id)}>
                        {acc.code ? `${acc.code} - ${acc.name}` : acc.name} ({acc.currency})
                      </option>
                    ))}
                </select>
                <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                  Choose the bank or cash account (same currency as this credit note) that is
                  funding this refund.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">
                  Transaction Cost ({creditNote?.currency })
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={transactionCost}
                  onChange={(e) => setTransactionCost(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="0.00"
                />
                <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                  Any transaction fees associated with this refund.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Forex Rate ({creditNote?.currency } to KES)</label>
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={forexRate}
                  onChange={(e) => setForexRate(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="1.0000"
                />
                <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                  Exchange rate to convert {creditNote?.currency } to KES.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-[10px] mt-[10px]">
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(false)}
                disabled={savingRefund}
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[12px] py-[7px] text-xs text-gray-500 border border-gray-200 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRefund}
                disabled={savingRefund}
                className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[12px] py-[7px] text-xs bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingRefund ? 'Saving…' : 'Save Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  )
}

export default CustCreditNoteDetailPage
