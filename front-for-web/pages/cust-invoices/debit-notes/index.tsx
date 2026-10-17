import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'
import Can from '../../../components/auth/Can'
import { ToastContainer } from '../../../components/common/Toast'
import { useToast } from '../../../hooks/useToast'
import { selectAccessToken } from '../../../store/auth/selectors'

interface DebitNote {
  id: number
  debit_note_number: string
  invoice_id: number
  title: string
  status: 'draft' | 'raised'
  currency: string
  total_amount: number
  created_at: string | null
  invoice?: { invoice_number?: string } | null
}

interface InvoiceOption {
  id: number
  invoice_number: string
  title: string
  currency: string
}

const CustomerDebitNotesPage: React.FC = () => {
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()
  const [notes, setNotes] = useState<DebitNote[]>([])
  const [invoices, setInvoices] = useState<InvoiceOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [invoiceId, setInvoiceId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [notesToCustomer, setNotesToCustomer] = useState('')

  const loadNotes = async () => {
    if (!accessToken) {
      setNotes([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/cust-debit-notes', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Failed to load customer debit notes')
      setNotes(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [])
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to load customer debit notes', 'error')
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadNotes()
  }, [accessToken])

  const openCreate = async () => {
    if (!accessToken) return
    setInvoiceId('')
    setTitle('')
    setDescription('')
    setNotesToCustomer('')
    setShowCreate(true)
    try {
      const response = await fetch('/api/cust-invoices/list?per_page=1000', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Failed to load customer invoices')
      const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      setInvoices(rows.map((invoice: any) => ({
        id: Number(invoice.id),
        invoice_number: String(invoice.invoice_number || invoice.id),
        title: String(invoice.title || ''),
        currency: String(invoice.currency || 'KES'),
      })))
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to load customer invoices', 'error')
      setInvoices([])
    }
  }

  const createDebitNote = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!accessToken || !invoiceId || !title.trim()) return
    setSaving(true)
    try {
      const response = await fetch('/api/cust-debit-notes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          invoice_id: Number(invoiceId),
          title: title.trim(),
          description: description.trim() || null,
          notes_to_customer: notesToCustomer.trim() || null,
        }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Failed to create debit note')
      const note = data?.data || data
      addToast('Debit note created. Add its line items and supporting documents.', 'success')
      setShowCreate(false)
      await loadNotes()
      if (note?.id) window.location.href = `/cust-invoices/debit-notes/${note.id}`
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to create debit note', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthenticatedLayout>
      <Can any={['ROLE_VIEW_CUST_DEBIT_NOTE']} fallback={<div>You do not have permission to view customer debit notes.</div>}>
        <ToastContainer toasts={toasts} onClose={removeToast} />
        <div className="mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-1">Customer Debit Notes</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Record additional amounts due against customer invoices.
            </p>
          </div>
          <Can any={['ROLE_ADD_CUST_DEBIT_NOTE']}>
            <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600">
              <span className="material-symbols-outlined text-base">add</span>
              New Debit Note
            </button>
          </Can>
        </div>

        <div className="trezo-card mb-[25px] rounded-md bg-white p-5 shadow-sm dark:bg-[#0c1427]">
          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">Loading customer debit notes…</p>
          ) : notes.length === 0 ? (
            <div className="py-10 text-center">
              <span className="material-symbols-outlined mb-2 text-4xl text-gray-400">request_quote</span>
              <p className="font-medium">No debit notes yet</p>
              <p className="mt-1 text-sm text-gray-500">Create a debit note to record an additional customer charge.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-500 dark:border-[#172036]">
                    <th className="px-3 py-3">Debit note</th>
                    <th className="px-3 py-3">Invoice</th>
                    <th className="px-3 py-3">Title</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Total</th>
                    <th className="px-3 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note) => (
                    <tr key={note.id} className="border-b border-gray-50 text-sm last:border-0 dark:border-[#172036]">
                      <td className="px-3 py-4 font-medium">
                        <Link href={`/cust-invoices/debit-notes/${note.id}`} className="text-primary-500 hover:underline">
                          {note.debit_note_number || `DN-${note.id}`}
                        </Link>
                      </td>
                      <td className="px-3 py-4">
                        {note.invoice?.invoice_number || (note.invoice_id ? `Invoice #${note.invoice_id}` : '—')}
                      </td>
                      <td className="px-3 py-4">{note.title || '—'}</td>
                      <td className="px-3 py-4">
                        <span className={`rounded px-2 py-1 text-xs capitalize ${note.status === 'raised' ? 'bg-info-50 text-info-600' : 'bg-warning-50 text-warning-600'}`}>
                          {note.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-right font-medium">
                        {new Intl.NumberFormat(undefined, { style: 'currency', currency: note.currency || 'KES' }).format(Number(note.total_amount || 0))}
                      </td>
                      <td className="px-3 py-4 text-gray-500">{note.created_at ? new Date(note.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showCreate && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
            <form onSubmit={createDebitNote} className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl dark:bg-[#0c1427]">
              <div className="mb-5 flex items-center justify-between">
                <h6 className="font-semibold">Create Customer Debit Note</h6>
                <button type="button" onClick={() => setShowCreate(false)} aria-label="Close" className="text-2xl text-gray-500">×</button>
              </div>
              <label className="mb-4 block text-sm">
                Customer invoice <span className="text-danger-500">*</span>
                <select required value={invoiceId} onChange={(event) => setInvoiceId(event.target.value)} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]">
                  <option value="">Select invoice</option>
                  {invoices.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>{invoice.invoice_number} — {invoice.title} ({invoice.currency})</option>
                  ))}
                </select>
              </label>
              <label className="mb-4 block text-sm">
                Title <span className="text-danger-500">*</span>
                <input required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" maxLength={255} />
              </label>
              <label className="mb-4 block text-sm">
                Description
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" rows={2} />
              </label>
              <label className="mb-6 block text-sm">
                Notes to customer
                <textarea value={notesToCustomer} onChange={(event) => setNotesToCustomer(event.target.value)} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" rows={2} />
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-md border border-gray-200 px-4 py-2 text-sm dark:border-[#172036]">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-md bg-primary-500 px-4 py-2 text-sm text-white disabled:opacity-50">{saving ? 'Creating…' : 'Create note'}</button>
              </div>
            </form>
          </div>
        )}
      </Can>
    </AuthenticatedLayout>
  )
}

export default CustomerDebitNotesPage
