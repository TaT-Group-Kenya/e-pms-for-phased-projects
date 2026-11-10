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

interface CustDebitNote {
  id: number
  debit_note_number: string
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
  items: CustDebitNoteItem[]
  payments?: CustPaymentSummary[] | null
  total_paid?: number | null
  invoice?: RelatedInvoiceSummary | null
}

interface CustDebitNoteItem {
  id: number
  debit_note_id: number
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

interface CustDebitNoteItemFormState {
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

interface CustPaymentSummary {
  id: number
  transaction_number?: string | null
  amount_paid: number
  payment_date?: string | null
  payment_method?: string | null
  payment_status?: string | null
  receipt_number?: string | null
  bank_name?: string | null
  check_number?: string | null
  reconciled?: boolean
  pivot?: {
    allocated_amount?: number
    payment_date?: string | null
    installment_number?: number
  } | null
}

interface AccountSummary {
  id: number
  code: string
  name: string
  currency: string
}

type DebitNoteStatus = 'draft' | 'raised' | 'partial-paid' | 'paid'

const CustDebitNoteDetailPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query

  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const [debitNote, setDebitNote] = useState<CustDebitNote | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState(0)
  const [updatingStatus, setUpdatingStatus] = useState<DebitNoteStatus | null>(null)

  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CustDebitNoteItem | null>(null)
  const [itemForm, setItemForm] = useState<CustDebitNoteItemFormState>({
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
  const [deleteItem, setDeleteItem] = useState<CustDebitNoteItem | null>(null)
  const [isDeletingItem, setIsDeletingItem] = useState(false)
  const [deleteItemError, setDeleteItemError] = useState<string | null>(null)

  const [taxes, setTaxes] = useState<TaxSummary[]>([])
  const [loadingTaxes, setLoadingTaxes] = useState(false)
  const [taxesError, setTaxesError] = useState<string | null>(null)

  const [ledgerRows, setLedgerRows] = useState<any[]>([])
  const [loadingLedger, setLoadingLedger] = useState(false)
  const [ledgerError, setLedgerError] = useState<string | null>(null)

  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [savingPayment, setSavingPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'bank_transfer' | 'check'>('cash')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'complete'>('complete')
  const [paymentAccountId, setPaymentAccountId] = useState('')
  const [receiptNumber, setReceiptNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankBranch, setBankBranch] = useState('')
  const [checkNumber, setCheckNumber] = useState('')
  const [chequeDate, setChequeDate] = useState('')

  const [editingPayment, setEditingPayment] = useState<any>(null)
  const [savingEditPayment, setSavingEditPayment] = useState(false)
  const [editPaymentStatus, setEditPaymentStatus] = useState<'pending' | 'complete'>('complete')
  const [editReceiptNumber, setEditReceiptNumber] = useState('')
  const [editBankName, setEditBankName] = useState('')
  const [editCheckNumber, setEditCheckNumber] = useState('')

  const [paymentToDelete, setPaymentToDelete] = useState<any>(null)
  const [deletingPayment, setDeletingPayment] = useState(false)

  const [accounts, setAccounts] = useState<AccountSummary[]>([])
  const [accountsLoading, setAccountsLoading] = useState(false)

  const [downloading, setDownloading] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)

  const [isEditingHeader, setIsEditingHeader] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [savingHeader, setSavingHeader] = useState(false)

  const fetchDebitNote = async () => {
    if (!id || !accessToken) return

    setLoading(true)
    try {
      const resp = await fetch(`/api/cust-debit-notes/${id}` as string, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to load customer debit note')
      }

      const dn = data?.data || data

      const rawItems = Array.isArray(dn?.items) ? dn.items : []
      const rawInvoice = dn?.invoice || null

      const mapped: CustDebitNote = {
        id: dn.id,
        debit_note_number: dn.debit_note_number ?? String(dn.id ?? ''),
        invoice_id:
          typeof dn.invoice_id === 'number' ? dn.invoice_id : dn.invoice_id ? Number(dn.invoice_id) : null,
        title: dn.title ?? null,
        description: dn.description ?? null,
        status: dn.status || 'draft',
        subtotal_amount: Number(dn.subtotal_amount ?? 0),
        tax_amount: Number(dn.tax_amount ?? 0),
        total_amount: Number(dn.total_amount ?? 0),
        currency: dn.currency || 'USD',
        notes_to_customer: dn.notes_to_customer ?? null,
        created_at: dn.created_at ?? null,
        updated_at: dn.updated_at ?? null,
        items: (rawItems || []).map((it: any): CustDebitNoteItem => ({
          id: Number(it.id),
          debit_note_id: Number(it.debit_note_id),
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
        payments: Array.isArray(dn?.payments)
          ? dn.payments.map((pmt: any) => ({
              id: Number(pmt.id),
              transaction_number: pmt.transaction_number ?? null,
              amount_paid: Number(pmt.amount_paid ?? 0),
              payment_date: pmt.payment_date ?? null,
              payment_method: pmt.payment_method ?? null,
              payment_status: pmt.payment_status ?? null,
              receipt_number: pmt.receipt_number ?? null,
              bank_name: pmt.bank_name ?? null,
              check_number: pmt.check_number ?? null,
              reconciled: Boolean(pmt.reconciled),
              pivot: pmt.pivot
                ? {
                    allocated_amount: pmt.pivot.allocated_amount != null ? Number(pmt.pivot.allocated_amount) : undefined,
                    payment_date: pmt.pivot.payment_date ?? null,
                    installment_number: pmt.pivot.installment_number != null ? Number(pmt.pivot.installment_number) : undefined,
                  }
                : null,
            }))
          : [],
        total_paid: dn.total_paid !== undefined && dn.total_paid !== null ? Number(dn.total_paid) : 0,
        invoice: rawInvoice
          ? {
              id: Number(rawInvoice.id),
              invoice_number: String(rawInvoice.invoice_number ?? rawInvoice.id ?? ''),
              currency: String(rawInvoice.currency ?? dn.currency ?? 'USD'),
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

      setDebitNote(mapped)
    } catch (e: any) {
      addToast(e?.message || 'Failed to load customer debit note', 'error')
      setDebitNote(null)
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

    setAccountsLoading(true)
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
        setAccounts([])
        if (resp.status !== 404 && resp.status !== 403) addToast(message, 'error')
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
      setAccounts([])
    } finally {
      setAccountsLoading(false)
    }
  }

  const loadLedgerForDebitNote = async (note: CustDebitNote | null) => {
    if (!note || !accessToken) return

    setLoadingLedger(true)
    setLedgerError(null)

    try {
      const params = new URLSearchParams()
      params.append('page', '1')
      params.append('per_page', '50')
      params.append('source_type', 'customer_debit_note')
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
      console.error('fetch debit note ledger error', err)
      setLedgerError('Error loading related transactions')
      setLedgerRows([])
    } finally {
      setLoadingLedger(false)
    }
  }

  const updateStatus = async (status: DebitNoteStatus) => {
    if (!debitNote || !accessToken) return

    if (status === 'raised' && (!debitNote.items || debitNote.items.length === 0)) {
      addToast('Add at least one line item before raising this debit note.', 'error')
      return
    }

    setUpdatingStatus(status)
    try {
      const resp = await fetch(`/api/cust-debit-notes/${debitNote.id}` as string, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      })

      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to update debit note status')
      }

      addToast(
        status === 'raised'
          ? 'Debit note raised and posted to the customer ledger.'
          : data?.message || 'Status updated successfully',
        'success',
      )
      await fetchDebitNote()
      if (status === 'raised') {
        await loadLedgerForDebitNote({ ...debitNote, id: debitNote.id } as any)
      }
    } catch (e: any) {
      addToast(e?.message || 'Failed to update debit note status', 'error')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleStartEditHeader = () => {
    if (!debitNote) return

    setEditTitle(debitNote.title || '')
    setEditDescription(debitNote.description || '')
    setEditNotes(debitNote.notes_to_customer || '')
    setIsEditingHeader(true)
  }

  const handleSaveHeader = async () => {
    if (!debitNote || !accessToken) return

    setSavingHeader(true)
    try {
      const resp = await fetch(`/api/cust-debit-notes/${debitNote.id}` as string, {
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
        throw new Error(data?.message || 'Failed to update debit note')
      }

      addToast(data?.message || 'Debit note updated successfully', 'success')
      setIsEditingHeader(false)
      await fetchDebitNote()
    } catch (e: any) {
      addToast(e?.message || 'Failed to update debit note', 'error')
    } finally {
      setSavingHeader(false)
    }
  }

  const handleOpenAddPaymentModal = () => {
    if (!debitNote) return
    setPaymentAmount(String(Math.max(totalOutstanding, 0).toFixed(2)))
    setPaymentDate(new Date().toISOString().slice(0, 10))
    setPaymentMethod('cash')
    setPaymentStatus('complete')
    setPaymentAccountId('')
    setReceiptNumber('')
    setBankName('')
    setBankBranch('')
    setCheckNumber('')
    setChequeDate('')
    setIsAddingPayment(true)
  }

  const handleSavePayment = async () => {
    if (!debitNote || !accessToken) return

    const amount = Number(paymentAmount)
    if (!paymentAmount || Number.isNaN(amount) || amount <= 0) {
      addToast('Enter a valid payment amount.', 'error')
      return
    }
    if (!paymentDate) {
      addToast('Payment date is required.', 'error')
      return
    }

    let computedReceipt: string | null = receiptNumber || null
    if (paymentMethod === 'check') {
      if (!chequeDate) {
        addToast('Cheque date is required for check payments.', 'error')
        return
      }
      const today = new Date().toISOString().slice(0, 10)
      if (chequeDate < today) {
        addToast('Cheque date cannot be in the past.', 'error')
        return
      }
      if (!bankName) {
        addToast('Bank name is required for check payments.', 'error')
        return
      }
      if (!checkNumber) {
        addToast('Check number is required for check payments.', 'error')
        return
      }
      if (!computedReceipt) {
        computedReceipt = `chk-${checkNumber}`
      }
    } else if (!receiptNumber) {
      addToast('Receipt number is required.', 'error')
      return
    }

    if (!paymentAccountId) {
      addToast('Please select a benefiting account.', 'error')
      return
    }

    setSavingPayment(true)
    try {
      const resp = await fetch(`/api/cust-debit-notes/${debitNote.id}/payments/receive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount_paid: amount,
          payment_date: paymentDate,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          bank_name: bankName || null,
          bank_branch: paymentMethod === 'check' ? (bankBranch || null) : null,
          check_number: checkNumber || null,
          cheque_date: paymentMethod === 'check' ? (chequeDate || paymentDate) : null,
          receipt_number: computedReceipt,
          account_id: Number(paymentAccountId),
        }),
      })

      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to receive payment')
      }

      setIsAddingPayment(false)
      addToast(data?.message || 'Payment received successfully.', 'success')
      await fetchDebitNote()
      await loadLedgerForDebitNote(debitNote)
      void loadAccounts()
    } catch (e: any) {
      addToast(e.message || 'Failed to receive payment', 'error')
    } finally {
      setSavingPayment(false)
    }
  }

  const handleOpenEditPaymentModal = (payment: any) => {
    setEditingPayment(payment)
    setEditPaymentStatus(payment.payment_status === 'pending' ? 'pending' : 'complete')
    setEditReceiptNumber(payment.receipt_number || '')
    setEditBankName(payment.bank_name || '')
    setEditCheckNumber(payment.check_number || '')
  }

  const handleSaveEditPayment = async () => {
    if (!debitNote || !accessToken || !editingPayment) return

    setSavingEditPayment(true)
    try {
      const resp = await fetch(`/api/cust-debit-notes/${debitNote.id}/payments/${editingPayment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          payment_status: editPaymentStatus,
          bank_name: editBankName || null,
          check_number: editCheckNumber || null,
          receipt_number: editReceiptNumber,
        }),
      })

      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to update payment')
      }

      setEditingPayment(null)
      addToast(data?.message || 'Payment updated successfully.', 'success')
      await fetchDebitNote()
      await loadLedgerForDebitNote(debitNote)
    } catch (e: any) {
      addToast(e.message || 'Failed to update payment', 'error')
    } finally {
      setSavingEditPayment(false)
    }
  }

  const handleConfirmDeletePayment = async () => {
    if (!debitNote || !accessToken || !paymentToDelete) return

    setDeletingPayment(true)
    try {
      const resp = await fetch(`/api/cust-debit-notes/${debitNote.id}/payments/${paymentToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to delete payment')
      }

      setPaymentToDelete(null)
      addToast(data?.message || 'Payment deleted successfully.', 'success')
      await fetchDebitNote()
      await loadLedgerForDebitNote(debitNote)
    } catch (e: any) {
      addToast(e.message || 'Failed to delete payment', 'error')
    } finally {
      setDeletingPayment(false)
    }
  }

  const handleSendEmail = async () => {
    if (!debitNote || !accessToken) return
    setSendingEmail(true)
    try {
      const resp = await fetch(`/api/cust-debit-notes/${debitNote.id}/send-email`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to send debit note email')
      }
      addToast(data?.message || 'Debit note emailed to customer successfully', 'success')
    } catch (e: any) {
      addToast(e?.message || 'Failed to send debit note email', 'error')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!debitNote || !accessToken) return
    setDownloading(true)
    try {
      const resp = await fetch(`/api/cust-debit-notes/${debitNote.id}/download-pdf`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (!resp.ok) {
        const data: any = await resp.json().catch(() => null)
        throw new Error(data?.message || 'Failed to download debit note PDF')
      }
      const blob = await resp.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `debit-note-${debitNote.debit_note_number}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      addToast('Debit note PDF downloaded', 'success')
    } catch (e: any) {
      addToast(e?.message || 'Failed to download debit note PDF', 'error')
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    if (!id || !accessToken) return
    fetchDebitNote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken])

  useEffect(() => {
    if (!accessToken) return
    loadTaxes()
    loadAccounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  useEffect(() => {
    if (!debitNote || !accessToken) return
    if (debitNote.status?.toLowerCase() === 'raised') {
      loadLedgerForDebitNote(debitNote)
    } else {
      setLedgerRows([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debitNote?.id, debitNote?.status, accessToken])

  const getStatusBadgeClass = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-warning-50 text-warning-500'
      case 'raised':
        return 'bg-info-50 text-info-500'
      case 'partial-paid':
        return 'bg-warning-50 text-warning-600'
      case 'paid':
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

  const handleOpenEditItemModal = (item: CustDebitNoteItem) => {
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

  const handleItemFormChange = (field: keyof CustDebitNoteItemFormState, value: any) => {
    setItemForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!debitNote) return

    if (!itemForm.item_name || !itemForm.item_amount || !itemForm.custom_note) {
      setItemError('Item name, amount, and custom note are required.')
      return
    }

    setIsItemSubmitting(true)
    setItemError(null)

    try {
      const payload: any = {
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
        ? '/api/cust-debit-note-items/update'
        : '/api/cust-debit-note-items/create'

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(
          isEditing ? { ...payload, id: editingItem?.id } : { ...payload, debit_note_id: debitNote.id },
        ),
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
      await fetchDebitNote()
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error saving debit note item:', err)
      setItemError('Unexpected error while saving line item.')
      addToast('Error saving line item', 'error')
    } finally {
      setIsItemSubmitting(false)
    }
  }

  const openDeleteItemModal = (item: CustDebitNoteItem) => {
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
      const resp = await fetch('/api/cust-debit-note-items/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: deleteItem.id }),
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
      await fetchDebitNote()
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error deleting debit note item:', err)
      setDeleteItemError('Unexpected error while deleting line item.')
      addToast('Error deleting line item', 'error')
    } finally {
      setIsDeletingItem(false)
    }
  }

  const itemsSubtotal = useMemo(() => {
    if (!debitNote?.items?.length) return 0
    return debitNote.items.reduce((sum, item) => sum + (item.total || 0), 0)
  }, [debitNote?.items])

  const itemsTaxTotal = useMemo(() => {
    if (!debitNote?.items?.length) return 0
    return debitNote.items.reduce((sum, item) => sum + (item.tax_amount || 0), 0)
  }, [debitNote?.items])

  const totalPaidOnNote = useMemo(() => {
    if (debitNote?.total_paid != null) return Number(debitNote.total_paid) || 0
    return (debitNote?.payments || [])
      .reduce((sum, pmt) => sum + (pmt.pivot?.allocated_amount ?? pmt.amount_paid ?? 0), 0)
  }, [debitNote?.total_paid, debitNote?.payments])

  const totalOutstanding = useMemo(
    () => Math.max((debitNote?.total_amount ?? 0) - totalPaidOnNote, 0),
    [debitNote?.total_amount, totalPaidOnNote],
  )

  if (loading && !debitNote) {
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

  if (!loading && !debitNote) {
    return (
      <AuthenticatedLayout>
        <div className="text-center py-[60px]">
          <p className="text-gray-500 dark:text-gray-400 mb-[20px]">
            Customer debit note not found
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

  if (!debitNote) return null

  const normalizedStatus = debitNote.status?.toLowerCase() as any
  const isDraft = normalizedStatus === 'draft'
  const isRaised = normalizedStatus === 'raised'
  const isPartialPaid = normalizedStatus === 'partial-paid'
  const isPaid = normalizedStatus === 'paid'
  const isSettling = isRaised || isPartialPaid

  return (
    <AuthenticatedLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-1">Customer Debit Note</h5>
          <p className="text-sm text-gray-500">
            Debit Note #{debitNote.debit_note_number || debitNote.id}
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
            Debit Note #{debitNote.debit_note_number || debitNote.id}
          </li>
        </ol>
      </div>

      {/* Header Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[20px]">
          <div>
            <h4 className="text-black dark:text-white text-xl font-semibold mb-[10px]">
              {debitNote.title || 'Untitled Debit Note'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Debit Note #: <span className="font-semibold">{debitNote.debit_note_number || debitNote.id}</span>
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
                            debitNote.status,
                          )}`}
                        >
                          {debitNote.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                        <span className="text-black dark:text-white font-semibold">
                          {debitNote.currency}
                        </span>
                      </div>

                      <div className="pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400 block mb-[8px]">
                          Description:
                        </span>
                        <p className="text-black dark:text-white text-sm">
                          {debitNote.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Debit Note Line Items Summary */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <div className="flex items-center justify-between mb-[10px]">
                      <h6 className="text-black dark:text-white font-semibold">
                        Debit Note Line Items
                      </h6>
                    </div>

                    {(!debitNote.items || debitNote.items.length === 0) && (
                      <p className="text-xs text-gray-500">No items on this debit note.</p>
                    )}

                    {debitNote.items && debitNote.items.length > 0 && (
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
                                Unit Price({ currencySymbols[debitNote.currency]})
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Tax({ currencySymbols[debitNote.currency]})
                              </th>
                              <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                                Line Total({ currencySymbols[debitNote.currency]})
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {debitNote.items.map((item) => (
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
                          {formatCurrency(debitNote.subtotal_amount, debitNote.currency)}
                        </span>
                      </div>

                      {debitNote.tax_amount > 0 && (
                        <div className="flex items-center justify-between pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <span className="text-gray-600 dark:text-gray-400">Tax</span>
                          <span className="font-medium">
                            {formatCurrency(debitNote.tax_amount, debitNote.currency)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-[15px] border-t-2 border-gray-200 dark:border-[#172036] text-base">
                        <span className="font-semibold">Total Due</span>
                        <span className="font-semibold text-primary-500 text-lg">
                          {formatCurrency(debitNote.total_amount, debitNote.currency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-[10px] text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total paid</span>
                        <span className="font-medium text-success-600 dark:text-success-400">
                          {formatCurrency(totalPaidOnNote, debitNote.currency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Outstanding balance</span>
                        <span className="font-semibold text-warning-500">
                          {formatCurrency(totalOutstanding, debitNote.currency)}
                        </span>
                      </div>

                      {isRaised && (
                        <div className="flex items-center justify-between pt-[10px]">
                          <span className="font-semibold">Ledger Status</span>
                          <span className="font-semibold text-info-600 dark:text-info-400">
                            Posted to customer ledger
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  {debitNote.notes_to_customer && (
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
                            {debitNote.notes_to_customer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Debit Note Summary */}
                  <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                    <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                      Debit Note Summary
                    </h6>

                    <div className="space-y-[10px] text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Debit Note #</span>
                        <span className="text-black dark:text-white font-medium">
                          {debitNote.debit_note_number || debitNote.id}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Currency</span>
                        <span className="text-black dark:text-white font-medium">
                          {debitNote.currency}
                        </span>
                      </div>

                      {debitNote.invoice && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Invoice #</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/cust-invoices/${debitNote.invoice.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {debitNote.invoice.invoice_number}
                            </Link>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Related Invoice Summary */}
                  {debitNote.invoice && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Related Invoice Summary
                      </h6>

                      <div className="space-y-[10px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Invoice: </span>
                          <span className="text-black dark:text-white font-medium w-64">
                            <Link
                              href={`/cust-invoices/${debitNote.invoice.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {debitNote.invoice.title || debitNote.invoice.invoice_number}
                            </Link>
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Amount: </span>
                          <span className="text-black dark:text-white font-medium">
                            {formatCurrency(
                              (debitNote.invoice.total_amount ?? debitNote.total_amount) || 0,
                              debitNote.invoice.currency,
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Currency: </span>
                          <span className="text-black dark:text-white font-medium">
                            {debitNote.invoice.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer */}
                  {debitNote.invoice?.customer && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Customer
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/customer/${debitNote.invoice.customer.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {debitNote.invoice.customer.name}
                            </Link>
                          </span>
                        </div>

                        {debitNote.invoice.customer.email && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Email</span>
                            <span className="text-black dark:text-white">
                              {debitNote.invoice.customer.email}
                            </span>
                          </div>
                        )}

                        {debitNote.invoice.customer.phone && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Phone</span>
                            <span className="text-black dark:text-white">
                              {debitNote.invoice.customer.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project */}
                  {debitNote.invoice?.project && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Project
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/project/${debitNote.invoice.project.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {debitNote.invoice.project.name}
                            </Link>
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Code</span>
                          <span className="text-black dark:text-white">
                            {debitNote.invoice.project.code}
                          </span>
                        </div>

                        {debitNote.invoice.project.status && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Status</span>
                            <span className="text-black dark:text-white capitalize">
                              {debitNote.invoice.project.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Linked Order */}
                  {debitNote.invoice?.order && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Linked Order
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Order #</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/orders/${debitNote.invoice.order.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {debitNote.invoice.order.order_number}
                            </Link>
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Status</span>
                          <span className="text-black dark:text-white capitalize">
                            {debitNote.invoice.order.status}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total</span>
                          <span className="text-black dark:text-white font-medium">
                            {formatCurrency(
                              debitNote.invoice.order.total_amount,
                              debitNote.invoice.order.currency,
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
                          disabled={updatingStatus !== null || !isRaised}
                          title="Raised debit notes cannot be reverted to draft."
                          className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[10px] py-[6px] text-xs border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Mark Draft
                        </button>
                        <Can any={['ROLE_EDIT_CUST_DEBIT_NOTE']}>
                          <button
                            type="button"
                            onClick={() => updateStatus('raised')}
                            disabled={updatingStatus !== null || !isDraft || !debitNote.items || debitNote.items.length === 0}
                            title={
                              !debitNote.items || debitNote.items.length === 0
                                ? 'Add at least one line item before raising this debit note.'
                                : undefined
                            }
                            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[10px] py-[6px] text-xs border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingStatus === 'raised' ? 'Raising…' : 'Mark Raised'}
                          </button>
                        </Can>
                      </div>

                      <Can any={['ROLE_EDIT_CUST_DEBIT_NOTE']}>
                        <button
                          type="button"
                          onClick={handleStartEditHeader}
                          disabled={!isDraft || updatingStatus !== null}
                          title={
                            !isDraft
                              ? 'Raised debit notes cannot be edited.'
                              : undefined
                          }
                          className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="material-symbols-outlined mr-[8px] !text-[20px]">edit</i>
                          Edit Debit Note Header
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
                        disabled={sendingEmail || !isRaised}
                        title={
                          !isRaised
                            ? 'Raise the debit note before emailing it to the customer.'
                            : undefined
                        }
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
                    Debit Note Line Items
                  </h6>
                  <div className="text-right">
                    <Can any={['ROLE_ADD_CUST_DEBIT_NOTE_ITEM']}>
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
                        Line items can only be added when the debit note status is
                        {' '}
                        <span className="font-medium">draft</span>.
                      </p>
                    )}
                  </div>
                </div>

                {(!debitNote.items || debitNote.items.length === 0) && (
                  <p className="text-xs text-gray-500">No items on this debit note.</p>
                )}

                {debitNote.items && debitNote.items.length > 0 && (
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
                            Unit Price({currencySymbols[debitNote.currency]})
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Tax({currencySymbols[debitNote.currency]})
                          </th>
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Line Total({currencySymbols[debitNote.currency]})
                          </th>
                          {isDraft && (
                            <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {debitNote.items.map((item) => (
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
                                <Can any={['ROLE_EDIT_CUST_DEBIT_NOTE_ITEM']}>
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:underline mr-2"
                                    onClick={() => handleOpenEditItemModal(item)}
                                    disabled={isItemSubmitting}
                                  >
                                    Edit
                                  </button>
                                </Can>
                                <Can any={['ROLE_DELETE_CUST_DEBIT_NOTE_ITEM']}>
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-2 py-1 text-xs text-red-600 hover:underline"
                                    onClick={() => openDeleteItemModal(item)}
                                    disabled={isItemSubmitting}
                                  >
                                    Delete
                                  </button>
                                </Can>
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
              <div className="flex items-center justify-between gap-[15px] flex-wrap">
                <div>
                  <h6 className="text-sm font-semibold text-black dark:text-white">
                    Related Transactions
                  </h6>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Customer ledger entries and payments linked to this debit note.
                  </p>
                </div>
                <div className="text-right">
                  <Can any={['ROLE_EDIT_CUST_DEBIT_NOTE']}>
                    <button
                      type="button"
                      onClick={() => updateStatus('raised')}
                      disabled={!isDraft || updatingStatus !== null || !debitNote.items || debitNote.items.length === 0}
                      title={
                        !isDraft
                          ? 'This debit note has already been posted to the customer ledger.'
                          : !debitNote.items || debitNote.items.length === 0
                          ? 'Add at least one line item before raising this debit note.'
                          : undefined
                      }
                      className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-warning-100 dark:bg-warning-950 text-warning-700 hover:bg-warning-100 dark:hover:bg-warning-900 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="material-symbols-outlined mr-[6px] !text-[18px]">upload</i>
                      {updatingStatus === 'raised' ? 'Posting…' : 'Raise Debit Note'}
                    </button>
                  </Can>
                  {!isDraft && (
                    <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                      Only <span className="font-medium">draft</span> debit notes can be posted to
                      the ledger.
                    </p>
                  )}
                </div>
              </div>

              {/* Settlement Summary */}
              <div className="trezo-card bg-white dark:bg-[#0c1427] p-[15px] md:p-[20px] rounded-md">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-[15px] text-sm">
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mb-[4px]">
                      Note Total
                    </span>
                    <span className="font-semibold text-black dark:text-white">
                      {formatCurrency(debitNote.total_amount, debitNote.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mb-[4px]">
                      Total Paid
                    </span>
                    <span className="font-semibold text-success-600 dark:text-success-400">
                      {formatCurrency(totalPaidOnNote, debitNote.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mb-[4px]">
                      Outstanding Balance
                    </span>
                    <span className="font-semibold text-warning-600 dark:text-warning-400">
                      {formatCurrency(totalOutstanding, debitNote.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payments */}
              <div className="flex items-center justify-between">
                <h6 className="text-sm font-semibold text-black dark:text-white">
                  Payments Received
                </h6>
                <Can any={['ROLE_ADD_CUST_PAYMENT']}>
                  <button
                    type="button"
                    onClick={handleOpenAddPaymentModal}
                    disabled={!isSettling || isPaid}
                    title={
                      isDraft
                        ? 'Raise the debit note before receiving payments.'
                        : isPaid
                        ? 'This debit note is fully paid.'
                        : undefined
                    }
                    className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-warning-50 dark:bg-warning-950 text-warning-500 hover:bg-warning-100 dark:hover:bg-warning-900 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="material-symbols-outlined mr-[6px] !text-[18px]">payments</i>
                    Receive Payment
                  </button>
                </Can>
              </div>

              <div className="trezo-card bg-white dark:bg-[#0c1427] border border-gray-100 dark:border-[#172036] rounded-md overflow-hidden">
                <div className="table-responsive overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="text-black dark:text-white">
                      <tr>
                        <th className="font-medium ltr:text-left rtl:text-right px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                          Receipt #
                        </th>
                        <th className="font-medium ltr:text-left rtl:text-right px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                          Date
                        </th>
                        <th className="font-medium ltr:text-left rtl:text-right px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                          Method
                        </th>
                        <th className="font-medium ltr:text-left rtl:text-right px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                          Reference
                        </th>
                        <th className="font-medium ltr:text-right rtl:text-left px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                          Amount
                        </th>
                        <th className="font-medium ltr:text-right rtl:text-left px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                          Status
                        </th>
                        <th className="font-medium ltr:text-right rtl:text-left px-[16px] py-[10px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-black dark:text-white">
                      {debitNote.payments && debitNote.payments.length > 0 ? (
                        debitNote.payments.map((pmt) => (
                          <tr
                            key={pmt.id}
                            className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                          >
                            <td className="px-[16px] py-[10px] whitespace-nowrap">
                              {pmt.transaction_number || `#${pmt.id}`}
                            </td>
                            <td className="px-[16px] py-[10px] whitespace-nowrap">
                              {pmt.payment_date
                                ? new Date(pmt.payment_date).toLocaleDateString()
                                : '-'}
                            </td>
                            <td className="px-[16px] py-[10px] whitespace-nowrap capitalize">
                              {(pmt.payment_method || '-').replace('_', ' ')}
                            </td>
                            <td className="px-[16px] py-[10px] whitespace-nowrap">
                              {pmt.receipt_number || pmt.check_number || '-'}
                            </td>
                            <td className="px-[16px] py-[10px] whitespace-nowrap text-right font-semibold">
                              {formatCurrency(pmt.pivot?.allocated_amount ?? pmt.amount_paid, debitNote.currency)}
                            </td>
                            <td className="px-[16px] py-[10px] whitespace-nowrap text-right capitalize">
                              {pmt.payment_status || '-'}
                            </td>
                            <td className="px-[16px] py-[10px] whitespace-nowrap text-right">
                              <Can any={['ROLE_EDIT_CUST_PAYMENT']}>
                                <button
                                  type="button"
                                  className="inline-flex items-center px-2 py-1 text-xs text-primary-500 hover:underline mr-2"
                                  onClick={() => handleOpenEditPaymentModal(pmt)}
                                >
                                  Edit
                                </button>
                              </Can>
                              <Can any={['ROLE_DELETE_CUST_PAYMENT']}>
                                <button
                                  type="button"
                                  className="inline-flex items-center px-2 py-1 text-xs text-red-600 hover:underline"
                                  onClick={() => setPaymentToDelete(pmt)}
                                  disabled={pmt.reconciled}
                                  title={
                                    pmt.reconciled
                                      ? 'Reconciled payments cannot be deleted.'
                                      : undefined
                                  }
                                >
                                  Delete
                                </button>
                              </Can>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center px-[16px] py-[20px] text-gray-500 dark:text-gray-400"
                          >
                            {isDraft
                              ? 'Receive payments after this debit note is raised.'
                              : 'No payments received against this debit note yet.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {ledgerError && (
                <div className="mb-[10px] p-[10px] rounded-md bg-danger-50 dark:bg-[#2a1a1a] border border-danger-200 dark:border-danger-900 text-xs text-danger-700 dark:text-danger-300">
                  {ledgerError}
                </div>
              )}

              <h6 className="text-sm font-semibold text-black dark:text-white">
                Customer Ledger Entries
              </h6>

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
                                {formatCurrency(Number(row.amount ?? 0), debitNote?.currency || 'USD')}
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
                              No related transactions found for this debit note
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
                  placeholder="E.g. Additional phase work"
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
                    Amount
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
                          : debitNote
                          ? `in ${debitNote.currency}`
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
                debit note?
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
              Edit Debit Note Header
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
                  This maps to the debit note's notes to customer field.
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
              <Can any={['ROLE_EDIT_CUST_DEBIT_NOTE']}>
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

      {isAddingPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md shadow-lg w-[90%] max-w-xl max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Receive Payment
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-[15px]">
              Record a payment received from the customer against debit note{' '}
              <span className="font-medium">{debitNote.debit_note_number}</span>. This posts a credit
              entry to the customer ledger and credits the selected account.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[20px]">
              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Amount Paid</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-[5px] text-xs text-gray-500 dark:text-gray-400">
                  Amount is in the debit note currency ({debitNote.currency}).
                </p>
                <p className="mt-[2px] text-[11px] text-gray-500 dark:text-gray-400">
                  Outstanding balance on this debit note:{' '}
                  {formatCurrency(totalOutstanding, debitNote.currency)}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Payment Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as 'cash' | 'mpesa' | 'bank_transfer' | 'check')
                  }
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="cash">Cash</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as 'pending' | 'complete')}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option disabled value="pending">Pending</option>
                  <option value="complete">Complete</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Benefiting Account</label>
                <p className="mb-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                  Showing accounts in currency <span className="font-medium">{debitNote.currency}</span> only.
                </p>
                <select
                  value={paymentAccountId}
                  onChange={(e) => setPaymentAccountId(e.target.value)}
                  disabled={accountsLoading}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{accountsLoading ? 'Loading accounts…' : 'Select account'}</option>
                  {accounts
                    .filter((account) => account.currency === debitNote.currency)
                    .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </option>
                    ))}
                </select>
                {!accountsLoading &&
                  accounts.filter((a) => a.currency === debitNote.currency).length === 0 && (
                    <p className="mt-[4px] text-[11px] text-warning-600 dark:text-warning-400">
                      No benefiting accounts are configured for currency {debitNote.currency}.
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Receipt / Transaction Reference</label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Bank Name (optional)</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Cheque Number (optional)</label>
                <input
                  type="text"
                  value={checkNumber}
                  onChange={(e) => setCheckNumber(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {paymentMethod === 'check' && (
                <>
                  <div>
                    <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Cheque Date</label>
                    <input
                      type="date"
                      value={chequeDate}
                      onChange={(e) => setChequeDate(e.target.value)}
                      className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                      Future-dated cheques are parked as post-dated cheques and posted when cleared.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Bank Branch (optional)</label>
                    <input
                      type="text"
                      value={bankBranch}
                      onChange={(e) => setBankBranch(e.target.value)}
                      className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </>
              )}
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
              <Can any={['ROLE_ADD_CUST_PAYMENT']}>
                <button
                  type="button"
                  onClick={handleSavePayment}
                  disabled={savingPayment}
                  className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingPayment ? 'Saving…' : 'Save Payment'}
                </button>
              </Can>
            </div>
          </div>
        </div>
      )}

      {editingPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md shadow-lg w-[90%] max-w-xl max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Edit Payment
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-[15px]">
              Financial fields (amount, date, account or currency) cannot be edited. Delete and
              re-add the payment with corrected values.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[20px]">
              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Status</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value as 'pending' | 'complete')}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="pending">Pending</option>
                  <option value="complete">Complete</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Receipt / Transaction Reference</label>
                <input
                  type="text"
                  value={editReceiptNumber}
                  onChange={(e) => setEditReceiptNumber(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Bank Name (optional)</label>
                <input
                  type="text"
                  value={editBankName}
                  onChange={(e) => setEditBankName(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px] text-black dark:text-white">Cheque Number (optional)</label>
                <input
                  type="text"
                  value={editCheckNumber}
                  onChange={(e) => setEditCheckNumber(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => setEditingPayment(null)}
                disabled={savingEditPayment}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditPayment}
                disabled={savingEditPayment}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingEditPayment ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] w-full max-w-md">
            <div className="mb-[12px]">
              <h6 className="font-semibold text-black dark:text-white mb-[4px]">Confirm Delete Payment</h6>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Deleting payment{' '}
                <span className="font-medium">{paymentToDelete.transaction_number || `#${paymentToDelete.id}`}</span>{' '}
                ({formatCurrency(paymentToDelete.pivot?.allocated_amount ?? paymentToDelete.amount_paid, debitNote.currency)}) will reverse
                its customer ledger entry and restore the outstanding balance on this debit note.
              </p>
            </div>

            <div className="flex items-center justify-end gap-[10px] mt-[10px]">
              <button
                type="button"
                onClick={() => setPaymentToDelete(null)}
                disabled={deletingPayment}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePayment}
                disabled={deletingPayment}
                className="px-[13px] py-[8px] rounded-md bg-danger-500 text-white text-sm font-medium hover:bg-danger-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingPayment ? 'Deleting…' : 'Delete Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  )
}

export default CustDebitNoteDetailPage
