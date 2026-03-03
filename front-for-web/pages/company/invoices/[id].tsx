import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'
import { ToastContainer } from '../../../components/common/Toast'
import { useToast } from '../../../hooks/useToast'
import { selectAccessToken } from '../../../store/auth/selectors'

interface ProjectPhaseSummary {
  id: number
  code: string
  name: string
  status?: string | null
}

interface CompanyInvoiceItem {
  id: number
  item_name: string
  item_description?: string | null
  quantity?: number | null
  item_amount: number
  total?: number | null
  project_phase_id?: number | null
  projectPhase?: ProjectPhaseSummary | null
  is_taxable?: boolean | null
}

interface CompanyInvoiceTaxItem {
  id: number
  item_name: string
  item_type: string
  item_value?: number | null
  item_amount?: number | null
}

interface CompanyBankAccountSummary {
  id: number
  type: string
  account_no: string
  swiftcode?: string | null
  branch?: string | null
  account_holder_name: string
}

interface TaxSummary {
  id: number
  name: string
  code: string
  description?: string | null
}

interface CompanyPaymentSummary {
  id: number
  payment_date: string | null
  amount_paid: number
  currency: string
  payment_status: string
  payment_method?: string | null
  bank_name?: string | null
  check_number?: string | null
  transaction_reference?: string | null
  receipt_number?: string | null
  reconciled?: boolean
}

interface CompanyCreditNoteSummary {
  id: number
  title: string
  status: string
  total_amount: number
  currency: string
}

interface ProjectSummary {
  id: number
  code: string
  name: string
  status?: string | null
}

interface ProjectWithPhasesSummary extends ProjectSummary {
  phases?: ProjectPhaseSummary[]
}

interface CompanySummary {
  id: number
  name: string
  email?: string | null
  phone?: string | null
  contact_person_name?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
   bank_accounts?: CompanyBankAccountSummary[]
}

interface AccountSummary {
  id: number
  code: string
  name: string
}

type CompanyInvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'partially-paid'
  | 'cancelled'

interface CompanyInvoice {
  id: number
  invoice_number: string
  company_id?: number | null
  project_phase_id?: number | null
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
  invoiceItems?: CompanyInvoiceItem[]
  taxitems?: CompanyInvoiceTaxItem[]
  payments?: CompanyPaymentSummary[]
  creditnotes?: CompanyCreditNoteSummary[]
  project?: ProjectWithPhasesSummary
}

export default function CompanyInvoiceDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const [invoice, setInvoice] = useState<CompanyInvoice | null>(null)
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

  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'bank_transfer' | 'check'>('cash')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'complete'>('complete')
  const [bankName, setBankName] = useState('')
  const [checkNumber, setCheckNumber] = useState('')
  const [receiptNumber, setReceiptNumber] = useState('')
  const [savingPayment, setSavingPayment] = useState(false)

  const [isEditingPayment, setIsEditingPayment] = useState(false)
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null)
  const [editPaymentStatus, setEditPaymentStatus] = useState<'pending' | 'complete'>('complete')
  const [editBankName, setEditBankName] = useState('')
  const [editCheckNumber, setEditCheckNumber] = useState('')
  const [editReceiptNumber, setEditReceiptNumber] = useState('')
  const [savingPaymentEdit, setSavingPaymentEdit] = useState(false)

  const [paymentToDelete, setPaymentToDelete] = useState<CompanyPaymentSummary | null>(null)
  const [deletingPayment, setDeletingPayment] = useState(false)

  const [accounts, setAccounts] = useState<AccountSummary[]>([])
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState('')

  const [isAddingCreditNote, setIsAddingCreditNote] = useState(false)
  const [creditNoteTitle, setCreditNoteTitle] = useState('')
  const [creditNoteDescription, setCreditNoteDescription] = useState('')
  const [creditNoteNotes, setCreditNoteNotes] = useState('')
  const [savingCreditNote, setSavingCreditNote] = useState(false)

  const [updatingStatus, setUpdatingStatus] = useState<CompanyInvoiceStatus | null>(null)

  const [company, setCompany] = useState<CompanySummary | null>(null)

  const [isAddingItem, setIsAddingItem] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [itemAmount, setItemAmount] = useState('')
  const [itemTaxable, setItemTaxable] = useState(true)
  const [savingItem, setSavingItem] = useState(false)

  const [isEditingItem, setIsEditingItem] = useState(false)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [editItemName, setEditItemName] = useState('')
  const [editItemDescription, setEditItemDescription] = useState('')
  const [editItemAmount, setEditItemAmount] = useState('')
  const [editItemTaxable, setEditItemTaxable] = useState(true)
  const [savingItemEdit, setSavingItemEdit] = useState(false)

  const [itemToDelete, setItemToDelete] = useState<CompanyInvoiceItem | null>(null)
  const [deletingItem, setDeletingItem] = useState(false)

  const [isAddingTaxItem, setIsAddingTaxItem] = useState(false)
  const [taxItemName, setTaxItemName] = useState('')
  const [taxItemType, setTaxItemType] = useState<'fixed' | 'percent'>('percent')
  const [taxItemValue, setTaxItemValue] = useState('')
  const [savingTaxItem, setSavingTaxItem] = useState(false)

  const [taxes, setTaxes] = useState<TaxSummary[]>([])
  const [loadingTaxes, setLoadingTaxes] = useState(false)
  const [taxesError, setTaxesError] = useState<string | null>(null)
  const [selectedTaxId, setSelectedTaxId] = useState<number | null>(null)

  const [isEditingTaxItem, setIsEditingTaxItem] = useState(false)
  const [editingTaxItemId, setEditingTaxItemId] = useState<number | null>(null)
  const [editTaxItemName, setEditTaxItemName] = useState('')
  const [editTaxItemType, setEditTaxItemType] = useState<'fixed' | 'percent'>('percent')
  const [editTaxItemValue, setEditTaxItemValue] = useState('')
  const [savingTaxItemEdit, setSavingTaxItemEdit] = useState(false)

  const [taxItemToDelete, setTaxItemToDelete] = useState<CompanyInvoiceTaxItem | null>(null)
  const [deletingTaxItem, setDeletingTaxItem] = useState(false)

  const { toasts, addToast, removeToast } = useToast()
  const accessToken = useSelector(selectAccessToken)

  const previewTaxAmount = useMemo(() => {
    if (!invoice) return null

    const rawValue = taxItemValue
    if (rawValue === '') return null

    const numericValue = Number(rawValue)
    if (Number.isNaN(numericValue)) return null

    const baseAmount = (invoice.invoiceItems || []).reduce((sum, item) => {
      const quantity = item.quantity ?? 1
      const unitAmount = item.item_amount ?? 0
      const lineTotal = item.total ?? unitAmount * quantity
      const numericTotal =
        typeof lineTotal === 'number' ? lineTotal : Number(lineTotal)
      return sum + (Number.isNaN(numericTotal) ? 0 : numericTotal)
    }, 0)

    if (taxItemType === 'fixed') {
      return numericValue
    }

    if (taxItemType === 'percent') {
      return baseAmount * (numericValue / 100)
    }

    return null
  }, [invoice, taxItemType, taxItemValue])

  const fetchInvoice = useCallback(async () => {
    if (!id) return
    if (!accessToken) return

    setLoading(true)
    try {
      const resp = await fetch(`/api/company-invoices/${id}` as string, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to load invoice')
      }

      const inv = (data?.data || data) as CompanyInvoice
      setInvoice(inv)
    } catch (e: any) {
      addToast(e.message || 'Failed to load invoice', 'error')
    } finally {
      setLoading(false)
    }
  }, [id, accessToken, addToast])

  useEffect(() => {
    if (!accessToken) return

    const controller = new AbortController()

    const fetchTaxes = async () => {
      setLoadingTaxes(true)
      setTaxesError(null)

      try {
        const resp = await fetch('/api/taxes/list?per_page=1000', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        })

        const data = await resp.json().catch(() => null)

        if (!resp.ok) {
          const message = data?.message || 'Failed to load taxes'
          setTaxesError(message)
          addToast(message, 'error')
          return
        }

        const list = (data?.data || data) as TaxSummary[]
        setTaxes(Array.isArray(list) ? list : [])
      } catch (err: any) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        // eslint-disable-next-line no-console
        console.error('fetch taxes error', err)
        setTaxesError('Error loading taxes')
      } finally {
        setLoadingTaxes(false)
      }
    }

    fetchTaxes()

    return () => controller.abort()
  }, [accessToken, addToast])

  useEffect(() => {
    fetchInvoice()
  }, [fetchInvoice])

  useEffect(() => {
    const loadCompany = async () => {
      if (!invoice?.company_id) return
      if (!accessToken) return

      try {
        const resp = await fetch(`/api/companies/${invoice.company_id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const data = await resp.json().catch(() => null)
        if (!resp.ok) return

        const comp = (data?.data || data) as CompanySummary
        setCompany(comp)
      } catch {
        // Ignore company load errors in invoice view
      }
    }

    loadCompany()
  }, [invoice?.company_id, accessToken])

  const fetchAccounts = useCallback(async () => {
    if (!accessToken) return

    setAccountsLoading(true)
    try {
      const resp = await fetch('/api/accounts/list?per_page=100', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to load accounts')
      }

      const items = (data?.data || []) as any[]
      const mapped: AccountSummary[] = items.map((item) => ({
        id: Number(item.id),
        code: String(item.code ?? ''),
        name: String(item.name ?? ''),
      }))
      setAccounts(mapped)
    } catch (e: any) {
      addToast(e.message || 'Failed to load accounts', 'error')
    } finally {
      setAccountsLoading(false)
    }
  }, [accessToken, addToast])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleSendEmail = async () => {
    if (!id) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    setSendingEmail(true)
    try {
      const resp = await fetch('/api/company-invoices/send-email', {
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
      const resp = await fetch(`/api/company-invoices/download-pdf?id=${id}` as string, {
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
      const filename = invoice?.invoice_number
        ? `${invoice.invoice_number}.pdf`
        : `company-invoice-${id}.pdf`
      a.download = filename
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
      const resp = await fetch(`/api/company-invoices/${id}` as string, {
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

      const inv = (data?.data || data) as CompanyInvoice
      setInvoice(inv)
      setIsEditing(false)
      addToast('Invoice updated successfully', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to update invoice', 'error')
    } finally {
      setSaving(false)
    }
  }

  const updateStatus = async (status: CompanyInvoiceStatus) => {
    if (!invoice || !accessToken) return

    if (status === 'sent' && (!invoice.invoiceItems || invoice.invoiceItems.length === 0)) {
      addToast('You cannot mark this invoice as sent because it has no items.', 'error')
      return
    }

    if (status === 'draft' && invoice.payments && invoice.payments.length > 0) {
      addToast('You cannot revert this invoice to draft because it has payment entries.', 'error')
      return
    }

    setUpdatingStatus(status)
    try {
      const resp = await fetch(`/api/company-invoices/${invoice.id}` as string, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      })

      const data = await resp.json().catch(() => null)

      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to update invoice status')
      }

      const updated = (data?.data || data) as CompanyInvoice
      setInvoice(updated)
      addToast(data?.message || 'Invoice status updated successfully', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to update invoice status', 'error')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleSaveItem = async () => {
    if (!invoice) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    if (invoice.status !== 'draft') {
      addToast('Invoice items can only be modified while the invoice is in draft status.', 'error')
      return
    }

    const amount = Number(itemAmount)
    if (!itemName.trim()) {
      addToast('Item name is required.', 'error')
      return
    }
    if (!itemAmount || Number.isNaN(amount) || amount <= 0) {
      addToast('Enter a valid item amount.', 'error')
      return
    }

    setSavingItem(true)
    try {
      const resp = await fetch('/api/company-invoice-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          invoice_id: invoice.id,
          project_phase_id: invoice.project_phase_id ?? null,
          item_name: itemName.trim(),
          item_description: itemDescription.trim() || null,
          item_amount: amount,
          is_taxable: itemTaxable,
        }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to add invoice item')
      }

      await fetchInvoice()
      setIsAddingItem(false)
      addToast('Invoice item added successfully.', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to add invoice item', 'error')
    } finally {
      setSavingItem(false)
    }
  }

  const handleStartEditItem = (item: CompanyInvoiceItem) => {
    setEditingItemId(item.id)
    setEditItemName(item.item_name)
    setEditItemDescription(item.item_description || '')
    setEditItemAmount(String(item.item_amount))
    setEditItemTaxable(item.is_taxable ?? true)
    setIsEditingItem(true)
  }

  const handleSaveItemEdit = async () => {
    if (!invoice || editingItemId == null) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    if (invoice.status !== 'draft') {
      addToast('Invoice items can only be modified while the invoice is in draft status.', 'error')
      return
    }

    const amount = Number(editItemAmount)
    if (!editItemName.trim()) {
      addToast('Item name is required.', 'error')
      return
    }
    if (!editItemAmount || Number.isNaN(amount) || amount <= 0) {
      addToast('Enter a valid item amount.', 'error')
      return
    }

    setSavingItemEdit(true)
    try {
      const resp = await fetch(`/api/company-invoice-items/${editingItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          item_name: editItemName.trim(),
          item_description: editItemDescription.trim() || null,
          item_amount: amount,
          is_taxable: editItemTaxable,
        }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to update invoice item')
      }

      await fetchInvoice()
      setIsEditingItem(false)
      setEditingItemId(null)
      addToast('Invoice item updated successfully.', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to update invoice item', 'error')
    } finally {
      setSavingItemEdit(false)
    }
  }

  const handleDeleteItem = (item: CompanyInvoiceItem) => {
    setItemToDelete(item)
  }

  const handleConfirmDeleteItem = async () => {
    if (!invoice || !itemToDelete) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    if (invoice.status !== 'draft') {
      addToast('Invoice items can only be deleted while the invoice is in draft status.', 'error')
      return
    }

    setDeletingItem(true)
    try {
      const resp = await fetch(`/api/company-invoice-items/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to delete invoice item')
      }

      await fetchInvoice()
      setItemToDelete(null)
      addToast('Invoice item deleted successfully.', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to delete invoice item', 'error')
    } finally {
      setDeletingItem(false)
    }
  }

  const handleSaveTaxItem = async () => {
    if (!invoice) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    if (invoice.status !== 'draft') {
      addToast('Tax items can only be modified while the invoice is in draft status.', 'error')
      return
    }

    if (!selectedTaxId && !taxItemName.trim()) {
      addToast('Tax item name is required.', 'error')
      return
    }

    const valueNum = Number(taxItemValue)
    if (!taxItemValue || Number.isNaN(valueNum) || valueNum < 0) {
      addToast('Enter a valid tax value.', 'error')
      return
    }

    setSavingTaxItem(true)
    try {
      const payload: any = {
        invoice_id: invoice.id,
        tax_id: selectedTaxId ?? null,
        item_name: (taxItemName || '').trim(),
        item_type: taxItemType,
        item_value: String(valueNum),
      }

      const resp = await fetch('/api/company-invoice-tax-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to add tax item')
      }

      await fetchInvoice()
      setIsAddingTaxItem(false)
      setSelectedTaxId(null)
      addToast('Tax item added successfully.', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to add tax item', 'error')
    } finally {
      setSavingTaxItem(false)
    }
  }

  const handleStartEditTaxItem = (item: CompanyInvoiceTaxItem) => {
    setEditingTaxItemId(item.id)
    setEditTaxItemName(item.item_name)
    setEditTaxItemType(item.item_type as 'fixed' | 'percent')

    const rawValue = item.item_value
    const numericValue =
      typeof rawValue === 'number' ? rawValue : rawValue != null ? Number(rawValue) : 0
    setEditTaxItemValue(Number.isNaN(numericValue) ? '' : String(numericValue))

    setIsEditingTaxItem(true)
  }

  const handleSaveTaxItemEdit = async () => {
    if (!invoice || editingTaxItemId == null) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    if (invoice.status !== 'draft') {
      addToast('Tax items can only be modified while the invoice is in draft status.', 'error')
      return
    }

    if (!editTaxItemName.trim()) {
      addToast('Tax item name is required.', 'error')
      return
    }

    const valueNum = Number(editTaxItemValue)
    if (!editTaxItemValue || Number.isNaN(valueNum) || valueNum < 0) {
      addToast('Enter a valid tax value.', 'error')
      return
    }

    setSavingTaxItemEdit(true)
    try {
      const resp = await fetch(`/api/company-invoice-tax-items/${editingTaxItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          item_name: editTaxItemName.trim(),
          item_type: editTaxItemType,
          item_value: String(valueNum),
        }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to update tax item')
      }

      await fetchInvoice()
      setIsEditingTaxItem(false)
      setEditingTaxItemId(null)
      addToast('Tax item updated successfully.', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to update tax item', 'error')
    } finally {
      setSavingTaxItemEdit(false)
    }
  }

  const handleDeleteTaxItem = (item: CompanyInvoiceTaxItem) => {
    setTaxItemToDelete(item)
  }

  const handleConfirmDeleteTaxItem = async () => {
    if (!invoice || !taxItemToDelete) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    if (invoice.status !== 'draft') {
      addToast('Tax items can only be deleted while the invoice is in draft status.', 'error')
      return
    }

    setDeletingTaxItem(true)
    try {
      const resp = await fetch(`/api/company-invoice-tax-items/${taxItemToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to delete tax item')
      }

      await fetchInvoice()
      setTaxItemToDelete(null)
      addToast('Tax item deleted successfully.', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to delete tax item', 'error')
    } finally {
      setDeletingTaxItem(false)
    }
  }

  const handleOpenAddPayment = () => {
    if (!invoice) return
    if (invoice.status === 'paid' || invoice.status === 'draft') {
      addToast('Payments cannot be added when the invoice is draft or paid.', 'error')
      return
    }
    setPaymentAmount('')
    setPaymentDate(new Date().toISOString().slice(0, 10))
    setPaymentMethod('cash')
    setPaymentStatus('complete')
    setBankName('')
    setCheckNumber('')
    setReceiptNumber('')
    setSelectedAccountId('')
    setIsAddingPayment(true)
  }

  const handleSavePayment = async () => {
    if (!invoice) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    if (invoice.status === 'paid' || invoice.status === 'draft') {
      addToast('Payments cannot be added when the invoice is draft or paid.', 'error')
      return
    }

    const amount = Number(paymentAmount)
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

    if (!selectedAccountId) {
      addToast('Please select an accounts account.', 'error')
      return
    }

    setSavingPayment(true)
    try {
      const resp = await fetch('/api/company-invoices/add-payment', {
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
          bank_name: bankName || null,
          check_number: checkNumber || null,
          receipt_number: receiptNumber,
          account_id: Number(selectedAccountId),
        }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to add payment')
      }

      const inv = (data?.data || data) as CompanyInvoice
      setInvoice(inv)
      setIsAddingPayment(false)
      addToast('Payment recorded successfully.', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to add payment', 'error')
    } finally {
      setSavingPayment(false)
    }
  }

  const handleStartEditPayment = (payment: CompanyPaymentSummary) => {
    setEditingPaymentId(payment.id)
    setEditPaymentStatus((payment.payment_status as 'pending' | 'complete') || 'complete')
    setEditBankName(payment.bank_name || '')
    setEditCheckNumber(payment.check_number || '')
    setEditReceiptNumber(payment.receipt_number || '')
    setIsEditingPayment(true)
  }

  const handleSavePaymentEdit = async () => {
    if (!invoice || editingPaymentId == null) return
    if (!accessToken) {
      addToast('You are not authenticated.', 'error')
      return
    }

    if (!editReceiptNumber.trim()) {
      addToast('Receipt number is required.', 'error')
      return
    }

    setSavingPaymentEdit(true)
    try {
      const resp = await fetch('/api/company-invoices/update-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: invoice.id,
          paymentId: editingPaymentId,
          payment_status: editPaymentStatus,
          bank_name: editBankName || null,
          check_number: editCheckNumber || null,
          receipt_number: editReceiptNumber,
        }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to update payment')
      }

      const inv = (data?.data || data) as CompanyInvoice
      setInvoice(inv)
      setIsEditingPayment(false)
      setEditingPaymentId(null)
      addToast('Payment updated successfully.', 'success')
    } catch (e: any) {
      addToast(e.message || 'Failed to update payment', 'error')
    } finally {
      setSavingPaymentEdit(false)
    }
  }

  const handleDeletePayment = async (payment: CompanyPaymentSummary) => {
    if (!invoice) return
    setPaymentToDelete(payment)
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

    if (invoice.status !== 'paid') {
      addToast('Credit notes can only be created for fully paid invoices.', 'error')
      return
    }

    const today = new Date().toISOString().slice(0, 10)

    setSavingCreditNote(true)
    try {
      const resp = await fetch('/api/company-credit-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          invoice_id: invoice.id,
          credit_note_date: today,
          reason: creditNoteTitle,
          subtotal_amount: 0,
          tax_amount: 0,
          total_amount: 0,
          currency: invoice.currency,
          exchange_rate: 1,
          status: 'draft',
        }),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        throw new Error(data?.message || 'Failed to create credit note')
      }

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
            Company invoice not found
          </p>
          <Link
            href="/company/invoices"
            className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[24px] py-[11px] bg-primary-500 text-white hover:bg-primary-600"
          >
            Back to Company Invoices
          </Link>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!invoice) return null

  const totalPayments = (invoice.payments || []).reduce(
    (sum, pmt) => sum + (pmt?.amount_paid ?? 0),
    0
  )

  const computedItemsSubtotal = (invoice.invoiceItems || []).reduce((sum, item) => {
    const quantity = item.quantity ?? 1
    const unitAmount = item.item_amount ?? 0
    const lineTotal = item.total ?? unitAmount * quantity
    const numericTotal = typeof lineTotal === 'number' ? lineTotal : Number(lineTotal)
    return sum + (Number.isNaN(numericTotal) ? 0 : numericTotal)
  }, 0)

  const computedTaxTotal = (invoice.taxitems || []).reduce((sum, item) => {
    const amount = item.item_amount ?? 0
    const numericAmount = typeof amount === 'number' ? amount : Number(amount)
    return sum + (Number.isNaN(numericAmount) ? 0 : numericAmount)
  }, 0)

  const hasTaxItems = !!invoice && Array.isArray(invoice.taxitems) && invoice.taxitems.length > 0

  const effectiveSubtotal =
    invoice.subtotal_amount && invoice.subtotal_amount !== 0
      ? invoice.subtotal_amount
      : computedItemsSubtotal

  const effectiveTax =
    invoice.tax_amount && invoice.tax_amount !== 0 ? invoice.tax_amount : computedTaxTotal

  const effectiveDiscount = invoice.discount_amount ?? 0

  const effectiveTotal =
    invoice.total_amount && invoice.total_amount !== 0
      ? invoice.total_amount
      : effectiveSubtotal + effectiveTax - effectiveDiscount

  const outstandingBalance = Math.max(effectiveTotal - totalPayments, 0)
  const canAddPayment = invoice.status !== 'paid' && invoice.status !== 'draft'

  const primaryPhase: ProjectPhaseSummary | null = (() => {
    if (!invoice) return null

    if (invoice.project?.phases && invoice.project.phases.length > 0 && invoice.project_phase_id) {
      const match = invoice.project.phases.find((p) => p.id === invoice.project_phase_id)
      if (match) return match
    }

    const itemPhase = invoice.invoiceItems?.find((it) => it.projectPhase)?.projectPhase
    return itemPhase || null
  })()

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
        return 'bg-gray-50 text-gray-600'
      case 'sent':
        return 'bg-info-50 text-info-500'
      case 'paid':
        return 'bg-success-50 text-success-500'
      case 'partially-paid':
        return 'bg-warning-50 text-warning-500'
      case 'overdue':
        return 'bg-danger-50 text-danger-500'
      case 'cancelled':
        return 'bg-gray-100 text-gray-400'
      default:
        return 'bg-gray-50 text-gray-500'
    }
  }

  const formatPaymentStatus = (status: string): string => {
    if (!status) return '-'
    const normalized = status.toLowerCase()
    if (normalized.startsWith('complete')) return 'Complete'
    if (normalized.startsWith('pending')) return 'Pending'
    return status
  }

  return (
    <AuthenticatedLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-1">Company Invoice</h5>
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
              href="/company/invoices"
              className="hover:text-primary-500"
            >
              Company Invoices
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

                      <div className="pt-[5px] pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400 block mb-[8px] text-xs">
                          Change Status:
                        </span>
                        <div className="flex flex-wrap gap-[6px]">
                          <button
                            type="button"
                            disabled={
                              invoice.status === 'draft' ||
                              updatingStatus !== null ||
                              (invoice.payments && invoice.payments.length > 0)
                            }
                            onClick={() => updateStatus('draft')}
                            className="px-[10px] py-[4px] text-xs rounded-md border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Mark Draft
                          </button>
                          <button
                            type="button"
                            disabled={
                              invoice.status === 'sent' ||
                              updatingStatus !== null ||
                              !invoice.invoiceItems ||
                              invoice.invoiceItems.length === 0
                            }
                            onClick={() => updateStatus('sent')}
                            className="px-[10px] py-[4px] text-xs rounded-md border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Mark Sent
                          </button>
                        </div>
                      </div>

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

                      {primaryPhase && (
                        <div className="flex justify-between items-center pt-[10px]">
                          <span className="text-gray-600 dark:text-gray-400">Project Phase:</span>
                          <span className="text-black dark:text-white text-sm text-right">
                            <span className="font-semibold">{primaryPhase.name}</span>
                            {primaryPhase.code && (
                              <span className="text-xs text-gray-500 ml-[6px]">({primaryPhase.code})</span>
                            )}
                          </span>
                        </div>
                      )}
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
                              <th className="text-xs font-semibold ltr:text-left rtl:text-right px-[15px] py-[12px]">
                                Phase
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
                                <td className="text-sm ltr:text-left rtl:text-right px-[15px] py-[12px]">
                                  {item.projectPhase ? (
                                    <span>
                                      <span className="font-medium">{item.projectPhase.name}</span>
                                      {item.projectPhase.code && (
                                        <span className="ml-[4px] text-xs text-gray-500">
                                          ({item.projectPhase.code})
                                        </span>
                                      )}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-gray-500">-</span>
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
                          {formatCurrency(effectiveSubtotal, invoice.currency)}
                        </span>
                      </div>

                      {hasTaxItems ? (
                        <div className="flex items-center justify-between pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <span className="text-gray-600 dark:text-gray-400">Tax (from items)</span>
                          <span className="font-medium">
                            {formatCurrency(computedTaxTotal, invoice.currency)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                          <span className="text-gray-600 dark:text-gray-400">Tax</span>
                          <span className="font-medium">
                            {formatCurrency(effectiveTax, invoice.currency)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pb-[15px] border-b border-gray-100 dark:border-[#172036]">
                        <span className="text-gray-600 dark:text-gray-400">Discount</span>
                        <span className="font-medium">
                          {formatCurrency(effectiveDiscount, invoice.currency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-[15px] border-t-2 border-gray-200 dark:border-[#172036] text-base">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold text-primary-500 text-lg">
                          {formatCurrency(
                            hasTaxItems
                              ? effectiveSubtotal + computedTaxTotal - effectiveDiscount
                              : effectiveTotal,
                            invoice.currency
                          )}
                        </span>
                      </div>

                      {invoice.status === 'partially-paid' && invoice.payments && invoice.payments.length > 0 && (
                        <div className="mt-[10px] pt-[10px] border-t border-dashed border-gray-200 dark:border-[#172036] space-y-[8px] text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Payments so far</span>
                            <span className="font-medium">
                              {formatCurrency(totalPayments, invoice.currency)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Outstanding balance</span>
                            <span className="font-semibold text-warning-500">
                              {formatCurrency(outstandingBalance, invoice.currency)}
                            </span>
                          </div>
                        </div>
                      )}
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
                              Notes:
                            </span>
                            <p className="text-black dark:text-white">
                              {invoice.notes_to_customer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Details (Company Bank Accounts) */}
                  {company && company.bank_accounts && company.bank_accounts.length > 0 && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[25px]">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Payment Details
                      </h6>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-[12px]">
                        Use any of the bank accounts below when paying this invoice.
                      </p>

                      <div className="space-y-[10px] text-xs md:text-sm">
                        {company.bank_accounts.map((account) => (
                          <div
                            key={account.id}
                            className="border border-gray-100 dark:border-[#172036] rounded-md p-[10px]"
                          >
                            <div className="flex justify-between mb-[4px]">
                              <span className="text-gray-600 dark:text-gray-400">Account Holder</span>
                              <span className="text-black dark:text-white font-medium">
                                {account.account_holder_name}
                              </span>
                            </div>
                            <div className="flex justify-between mb-[4px]">
                              <span className="text-gray-600 dark:text-gray-400">Account Number</span>
                              <span className="text-black dark:text-white font-medium">
                                {account.account_no}
                              </span>
                            </div>
                            <div className="flex justify-between mb-[4px]">
                              <span className="text-gray-600 dark:text-gray-400">Type</span>
                              <span className="text-black dark:text-white">
                                {account.type}
                                {account.branch && (
                                  <span className="ml-[4px] text-[11px] text-gray-500">
                                    ({account.branch})
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">SWIFT</span>
                              <span className="text-black dark:text-white">
                                {account.swiftcode || 'N/A'}
                              </span>
                            </div>
                          </div>
                        ))}
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

                  {/* Company */}
                  {company && (
                    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                      <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                        Company
                      </h6>

                      <div className="space-y-[8px] text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name</span>
                          <span className="text-black dark:text-white font-medium">
                            <Link
                              href={`/company/${company.id}`}
                              className="text-primary-500 hover:underline"
                            >
                              {company.name}
                            </Link>
                          </span>
                        </div>

                        {company.contact_person_name && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Contact</span>
                            <span className="text-black dark:text-white">
                              {company.contact_person_name}
                            </span>
                          </div>
                        )}

                        {company.email && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Email</span>
                            <span className="text-black dark:text-white">
                              {company.email}
                            </span>
                          </div>
                        )}

                        {company.phone && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Phone</span>
                            <span className="text-black dark:text-white">
                              {company.phone}
                            </span>
                          </div>
                        )}
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

                      <div>
                        <button
                          type="button"
                          onClick={handleOpenAddPayment}
                          disabled={['draft','paid'].includes(invoice.status)}
                          className="w-full inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[8px] bg-warning-50 dark:bg-warning-950 text-warning-500 hover:bg-warning-100 dark:hover:bg-warning-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="material-symbols-outlined mr-[8px] !text-[20px]">payments</i>
                          Add Payment
                        </button>
                        {['draft','paid'].includes(invoice.status) && (
                          <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                            Payments can only be added when the invoice status is <span className="font-medium">sent</span> or <span className="font-medium">partial-paid</span>.
                          </p>
                        )}
                      </div>
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
                <div className="flex items-center justify-between mb-[15px]">
                  <h6 className="text-black dark:text-white font-semibold">
                    Invoice Items
                  </h6>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (invoice.status !== 'draft') {
                          addToast('Invoice items can only be modified while the invoice is in draft status.', 'error')
                          return
                        }
                        setItemName(primaryPhase?.name || '')
                        setItemDescription('')
                        setItemAmount('')
                        setItemTaxable(true)
                        setIsAddingItem(true)
                      }}
                      disabled={invoice.status !== 'draft'}
                      className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="material-symbols-outlined mr-[6px] !text-[20px]">add</i>
                      Add Item
                    </button>
                    {invoice.status !== 'draft' && (
                      <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                        Items can only be added or changed while the invoice is <span className="font-medium">draft</span>.
                      </p>
                    )}
                  </div>
                </div>

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
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Actions
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
                            <td className="text-sm text-right px-[15px] py-[12px] space-x-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditItem(item)}
                                disabled={invoice.status !== 'draft'}
                                className="inline-flex items-center justify-center px-[8px] py-[4px] text-xs rounded-md border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item)}
                                disabled={invoice.status !== 'draft'}
                                className="inline-flex items-center justify-center px-[8px] py-[4px] text-xs rounded-md border border-danger-200 text-danger-600 hover:bg-danger-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Delete
                              </button>
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
                <div className="flex items-center justify-between mb-[15px]">
                  <h6 className="text-black dark:text-white font-semibold">
                    Tax Items
                  </h6>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (invoice.status !== 'draft') {
                          addToast('Tax items can only be modified while the invoice is in draft status.', 'error')
                          return
                        }
                        setTaxItemName('')
                        setTaxItemType('percent')
                        setTaxItemValue('')
                        setIsAddingTaxItem(true)
                      }}
                      disabled={invoice.status !== 'draft'}
                      className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="material-symbols-outlined mr-[6px] !text-[20px]">add</i>
                      Add Tax Item
                    </button>
                    {invoice.status !== 'draft' && (
                      <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                        Tax items can only be added or changed while the invoice is <span className="font-medium">draft</span>.
                      </p>
                    )}
                  </div>
                </div>

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
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Actions
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
                              {(() => {
                                if (item.item_value == null) return '-'

                                const numericValue =
                                  typeof item.item_value === 'number'
                                    ? item.item_value
                                    : Number(item.item_value)

                                if (Number.isNaN(numericValue)) return '-'

                                return item.item_type === 'percent'
                                  ? `${numericValue.toFixed(2)}%`
                                  : formatCurrency(numericValue, invoice.currency)
                              })()}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(item.item_amount ?? 0, invoice.currency)}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px] space-x-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditTaxItem(item)}
                                disabled={invoice.status !== 'draft'}
                                className="inline-flex items-center justify-center px-[8px] py-[4px] text-xs rounded-md border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTaxItem(item)}
                                disabled={invoice.status !== 'draft'}
                                className="inline-flex items-center justify-center px-[8px] py-[4px] text-xs rounded-md border border-danger-200 text-danger-600 hover:bg-danger-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Delete
                              </button>
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
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setIsAddingCreditNote(true)}
                      disabled={invoice.status !== 'paid'}
                      className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="material-symbols-outlined mr-[6px] !text-[20px]">add</i>
                      Add Credit Note
                    </button>
                    {invoice.status !== 'paid' && (
                      <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                        Credit notes can only be created when the invoice status is <span className="font-medium">paid</span>.
                      </p>
                    )}
                  </div>
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

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleOpenAddPayment}
                      disabled={!canAddPayment}
                      className="inline-flex items-center justify-center transition-all rounded-md font-medium px-[13px] py-[6px] bg-primary-50 dark:bg-primary-950 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="material-symbols-outlined mr-[6px] !text-[20px]">add</i>
                      Add Payment
                    </button>
                    {!canAddPayment && (
                      <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                        Payments cannot be added when the invoice status is <span className="font-medium">draft</span> or <span className="font-medium">paid</span>.
                      </p>
                    )}
                  </div>
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
                          <th className="text-xs font-semibold text-right px-[15px] py-[12px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(invoice.payments ?? []).map((pmt) => (
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
                              <span>{formatPaymentStatus(pmt.payment_status)}</span>
                              {Number(pmt.reconciled) === 1 && (
                                <span className="ml-2 inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-medium bg-success-50 text-success-600 dark:bg-success-900/40 dark:text-success-300">
                                  Reconciled
                                </span>
                              )}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px]">
                              {formatCurrency(pmt.amount_paid, pmt.currency)}
                            </td>
                            <td className="text-sm text-right px-[15px] py-[12px] space-x-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditPayment(pmt)}
                                className="inline-flex items-center justify-center px-[8px] py-[4px] text-xs rounded-md border border-gray-200 dark:border-[#172036] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={pmt.reconciled === true}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePayment(pmt)}
                                className="inline-flex items-center justify-center px-[8px] py-[4px] text-xs rounded-md border border-danger-200 text-danger-600 hover:bg-danger-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={pmt.reconciled === true}
                              >
                                Delete
                              </button>
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
                <label className="block text-sm font-medium mb-1">Notes</label>
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
                <p className="mt-[5px] text-xs text-gray-500 dark:text-gray-400">
                  Amount is in the invoice currency ({invoice?.currency}).
                </p>
                <p className="mt-[2px] text-[11px] text-gray-500 dark:text-gray-400">
                  Outstanding balance on this invoice:{' '}
                  {formatCurrency(outstandingBalance, invoice?.currency || 'USD')}.
                </p>
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
                <label className="block text-xs font-medium mb-[5px]">Receipt / Transaction Reference</label>
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
                <label className="block text-xs font-medium mb-[5px]">Accounts Account</label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  disabled={accountsLoading}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{accountsLoading ? 'Loading accounts…' : 'Select account'}</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </option>
                  ))}
                </select>
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

      {isAddingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Add Invoice Item
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[20px]">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-[5px]">Item Name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-[5px]">Description (optional)</label>
                <textarea
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  rows={3}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={itemAmount}
                  onChange={(e) => setItemAmount(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-[5px] text-xs text-gray-500 dark:text-gray-400">
                  Amount is in the invoice currency ({invoice?.currency}).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Taxable</label>
                <select
                  value={itemTaxable ? 'yes' : 'no'}
                  onChange={(e) => setItemTaxable(e.target.value === 'yes')}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                disabled={savingItem}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                disabled={savingItem}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingItem ? 'Saving…' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Edit Invoice Item
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[20px]">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-[5px]">Item Name</label>
                <input
                  type="text"
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-[5px]">Description (optional)</label>
                <textarea
                  value={editItemDescription}
                  onChange={(e) => setEditItemDescription(e.target.value)}
                  rows={3}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editItemAmount}
                  onChange={(e) => setEditItemAmount(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-[5px] text-xs text-gray-500 dark:text-gray-400">
                  Amount is in the invoice currency ({invoice?.currency}).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Taxable</label>
                <select
                  value={editItemTaxable ? 'yes' : 'no'}
                  onChange={(e) => setEditItemTaxable(e.target.value === 'yes')}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => setIsEditingItem(false)}
                disabled={savingItemEdit}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItemEdit}
                disabled={savingItemEdit}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingItemEdit ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddingTaxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Add Tax Item
            </h3>

            <div className="space-y-[15px] mb-[20px]">
              <div>
                <label className="mb-[10px] text-black dark:text-white font-medium block">
                  Tax Name <span className="text-danger-500">*</span>
                </label>
                <select
                  className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                  value={selectedTaxId ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    const id = value ? Number(value) : null
                    setSelectedTaxId(id)

                    const matched = taxes.find((t) => t.id === id) || null
                    if (matched) {
                      setTaxItemName(matched.name)
                    }
                  }}
                  disabled={loadingTaxes || taxes.length === 0}
                >
                  <option value="">
                    {loadingTaxes
                      ? 'Loading taxes…'
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
                  <p className="mt-[6px] text-[11px] text-danger-500">{taxesError}</p>
                )}
                <p className="mt-[6px] text-[11px] text-gray-500 dark:text-gray-400">
                  Choose a configured tax. You can adjust the type and value below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px]">
                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Type <span className="text-danger-500">*</span>
                  </label>
                  <select
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all focus:border-primary-500"
                    value={taxItemType}
                    onChange={(e) => setTaxItemType(e.target.value as 'fixed' | 'percent')}
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percent">Percentage</option>
                  </select>
                  <p className="mt-[6px] text-[11px] text-gray-500 dark:text-gray-400">
                    Fixed adds a flat amount; Percentage applies on the total of invoice items.
                  </p>
                </div>

                <div>
                  <label className="mb-[10px] text-black dark:text-white font-medium block">
                    Value{' '}
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      {taxItemType === 'percent'
                        ? 'as % of items total'
                        : `in ${invoice?.currency ?? ''}`}
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={taxItemValue}
                    onChange={(e) => setTaxItemValue(e.target.value)}
                    className="h-[44px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  />

                  {previewTaxAmount != null && invoice && (
                    <div className="mt-[6px] rounded-md border border-dashed border-primary-200 dark:border-primary-500/40 bg-primary-50/70 dark:bg-primary-500/10 px-[12px] py-[8px] text-xs">
                      <p className="text-gray-800 dark:text-gray-100">
                        Estimated tax on current items:{' '}
                        <span className="font-semibold">
                          {formatCurrency(previewTaxAmount, invoice.currency)}
                        </span>
                      </p>
                      {taxItemType === 'percent' && (
                        <p className="mt-[2px] text-[11px] text-gray-600 dark:text-gray-300">
                          Calculated from the sum of all invoice line items.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => {
                  setIsAddingTaxItem(false)
                  setSelectedTaxId(null)
                }}
                disabled={savingTaxItem}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTaxItem}
                disabled={savingTaxItem}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingTaxItem ? 'Saving…' : 'Save Tax Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingTaxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Edit Tax Item
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[20px]">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-[5px]">Name</label>
                <input
                  type="text"
                  value={editTaxItemName}
                  onChange={(e) => setEditTaxItemName(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Type</label>
                <select
                  value={editTaxItemType}
                  onChange={(e) => setEditTaxItemType(e.target.value as 'fixed' | 'percent')}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Value</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editTaxItemValue}
                  onChange={(e) => setEditTaxItemValue(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-[5px] text-xs text-gray-500 dark:text-gray-400">
                  {editTaxItemType === 'percent'
                    ? 'Value is a percentage (e.g. 16 for 16%).'
                    : `Value is a fixed amount in the invoice currency (${invoice?.currency}).`}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => setIsEditingTaxItem(false)}
                disabled={savingTaxItemEdit}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTaxItemEdit}
                disabled={savingTaxItemEdit}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingTaxItemEdit ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[10px]">
              Confirm Delete Invoice Item
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-[12px]">
              This will remove the invoice item and update the invoice totals accordingly.
            </p>

            <div className="border border-gray-200 dark:border-[#172036] rounded-md p-[12px] mb-[16px] text-xs space-y-[4px]">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Item</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {itemToDelete.item_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Amount</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {formatCurrency(itemToDelete.item_amount, invoice.currency)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-danger-600 dark:text-danger-400 mb-[16px]">
              This action cannot be undone from the UI. You may need to recreate the item if this was done in error.
            </p>

            <div className="flex justify-end space-x-[8px]">
              <button
                type="button"
                disabled={deletingItem}
                onClick={() => setItemToDelete(null)}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingItem}
                onClick={handleConfirmDeleteItem}
                className="px-[13px] py-[8px] rounded-md bg-danger-500 text-white text-xs font-medium hover:bg-danger-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingItem ? 'Deleting…' : 'Delete Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {taxItemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[10px]">
              Confirm Delete Tax Item
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-[12px]">
              This will remove the tax item and update the invoice totals accordingly.
            </p>

            <div className="border border-gray-200 dark:border-[#172036] rounded-md p-[12px] mb-[16px] text-xs space-y-[4px]">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Name</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {taxItemToDelete.item_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <span className="text-gray-900 dark:text-gray-100 capitalize">
                  {taxItemToDelete.item_type}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-danger-600 dark:text-danger-400 mb-[16px]">
              This action cannot be undone from the UI. You may need to recreate the tax item if this was done in error.
            </p>

            <div className="flex justify-end space-x-[8px]">
              <button
                type="button"
                disabled={deletingTaxItem}
                onClick={() => setTaxItemToDelete(null)}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingTaxItem}
                onClick={handleConfirmDeleteTaxItem}
                className="px-[13px] py-[8px] rounded-md bg-danger-500 text-white text-xs font-medium hover:bg-danger-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingTaxItem ? 'Deleting…' : 'Delete Tax Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[15px]">
              Edit Payment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-[20px]">
              <div>
                <label className="block text-xs font-medium mb-[5px]">Status</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value as 'pending' | 'complete')}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="pending">Pending</option>
                  <option value="complete">Complete</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Receipt / Transaction Reference</label>
                <input
                  type="text"
                  value={editReceiptNumber}
                  onChange={(e) => setEditReceiptNumber(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Bank Name (optional)</label>
                <input
                  type="text"
                  value={editBankName}
                  onChange={(e) => setEditBankName(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Cheque Number (optional)</label>
                <input
                  type="text"
                  value={editCheckNumber}
                  onChange={(e) => setEditCheckNumber(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <p className="mb-[15px] text-xs text-gray-500 dark:text-gray-400">
              Only non-financial details can be edited here. To change the amount, date or paying account, delete this payment and add a new one.
            </p>

            <div className="flex justify-end space-x-[10px]">
              <button
                type="button"
                onClick={() => setIsEditingPayment(false)}
                disabled={savingPaymentEdit}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePaymentEdit}
                disabled={savingPaymentEdit}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPaymentEdit ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[10px]">
              Confirm Delete Payment
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-[12px]">
              This will remove the payment below and adjust the invoice balance and related ledger entries.
            </p>

            <div className="border border-gray-200 dark:border-[#172036] rounded-md p-[12px] mb-[16px] text-xs space-y-[4px]">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Date</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {paymentToDelete!.payment_date
                    ? new Date(paymentToDelete!.payment_date as string).toLocaleDateString()
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Amount</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {formatCurrency(paymentToDelete!.amount_paid, paymentToDelete!.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="text-gray-900 dark:text-gray-100 capitalize">
                  {paymentToDelete!.payment_status}
                  {paymentToDelete!.reconciled && ' (reconciled)'}
                </span>
              </div>
              {paymentToDelete!.receipt_number && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Receipt / Ref</span>
                  <span className="text-gray-900 dark:text-gray-100 truncate max-w-[200px] text-right">
                    {paymentToDelete!.receipt_number}
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-danger-600 dark:text-danger-400 mb-[16px]">
              This action cannot be undone from the UI. You may need to create a new payment with corrected details.
            </p>

            <div className="flex justify-end space-x-[8px]">
              <button
                type="button"
                disabled={deletingPayment}
                onClick={() => setPaymentToDelete(null)}
                className="px-[13px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingPayment || !invoice}
                onClick={async () => {
                  if (!invoice || !paymentToDelete) return
                  if (!accessToken) {
                    addToast('You are not authenticated.', 'error')
                    return
                  }

                  setDeletingPayment(true)
                  try {
                    const resp = await fetch('/api/company-invoices/delete-payment', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                      },
                      body: JSON.stringify({
                        id: invoice.id,
                        paymentId: paymentToDelete.id,
                      }),
                    })

                    const data = await resp.json().catch(() => null)
                    if (!resp.ok) {
                      throw new Error(data?.message || 'Failed to delete payment')
                    }

                    const inv = (data?.data || data) as CompanyInvoice
                    setInvoice(inv)
                    setPaymentToDelete(null)
                    addToast('Payment deleted successfully.', 'success')
                  } catch (e: any) {
                    addToast(e.message || 'Failed to delete payment', 'error')
                  } finally {
                    setDeletingPayment(false)
                  }
                }}
                className="px-[13px] py-[8px] rounded-md bg-danger-500 text-white text-xs font-medium hover:bg-danger-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingPayment ? 'Deleting…' : 'Delete Payment'}
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
                <label className="block text-xs font-medium mb-[5px]">Notes (optional)</label>
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
