import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'
import Can from '../../../components/auth/Can'
import { ToastContainer } from '../../../components/common/Toast'
import { useToast } from '../../../hooks/useToast'
import { selectAccessToken } from '../../../store/auth/selectors'

interface DebitNoteItem {
  id: number
  item_name: string
  item_description: string
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

interface DebitNoteDocument {
  id: number
  document_name: string
  document_path: string
  created_at?: string | null
}

interface CustomerDebitNote {
  id: number
  debit_note_number: string
  invoice_id: number
  title: string
  description: string | null
  status: 'draft' | 'raised'
  subtotal_amount: number
  tax_amount: number
  total_amount: number
  currency: string
  notes_to_customer: string | null
  items: DebitNoteItem[]
  documents: DebitNoteDocument[]
  invoice?: {
    id: number
    invoice_number: string
    title?: string | null
    status?: string
    currency: string
    customer?: { name?: string | null } | null
  } | null
}

interface TaxOption {
  id: number
  name: string
  rate: number
  is_default?: boolean | number | null
}

interface ItemForm {
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

const emptyItem: ItemForm = {
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
}

const CustomerDebitNoteDetailPage: React.FC = () => {
  const router = useRouter()
  const noteId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()
  const [note, setNote] = useState<CustomerDebitNote | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingHeader, setSavingHeader] = useState(false)
  const [editingHeader, setEditingHeader] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [customerNotes, setCustomerNotes] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [taxes, setTaxes] = useState<TaxOption[]>([])
  const [itemForm, setItemForm] = useState<ItemForm>(emptyItem)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [savingItem, setSavingItem] = useState(false)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [uploadingDocument, setUploadingDocument] = useState(false)
  const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(null)

  const loadNote = async () => {
    if (!noteId || !accessToken) return
    setLoading(true)
    try {
      const response = await fetch(`/api/cust-debit-notes/${noteId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Failed to load debit note')
      setNote(data?.data || data)
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to load debit note', 'error')
      setNote(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadNote()
  }, [noteId, accessToken])

  useEffect(() => {
    if (!accessToken) return
    const loadTaxes = async () => {
      try {
        const response = await fetch('/api/taxes/list?per_page=1000', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) throw new Error(data?.message || 'Failed to load taxes')
        const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setTaxes(rows.map((tax: any) => ({
          id: Number(tax.id),
          name: String(tax.name || tax.code || `Tax ${tax.id}`),
          rate: Number(tax.rate ?? tax.percentage ?? 0),
          is_default: tax.is_default,
        })))
      } catch (error) {
        addToast(error instanceof Error ? error.message : 'Failed to load taxes', 'error')
      }
    }
    void loadTaxes()
  }, [accessToken])

  const saveHeader = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!note || !accessToken) return
    setSavingHeader(true)
    try {
      const response = await fetch(`/api/cust-debit-notes/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          notes_to_customer: customerNotes.trim() || null,
        }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Failed to update debit note')
      setEditingHeader(false)
      await loadNote()
      addToast('Debit note details updated.', 'success')
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to update debit note', 'error')
    } finally {
      setSavingHeader(false)
    }
  }

  const changeStatus = async () => {
    if (!note || !accessToken || note.status !== 'draft') return
    if (note.items.length === 0) {
      addToast('Add at least one line item before raising this debit note.', 'error')
      return
    }
    setSavingStatus(true)
    try {
      const response = await fetch(`/api/cust-debit-notes/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: 'raised' }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Failed to raise debit note')
      await loadNote()
      addToast('Debit note raised and added to the customer ledger.', 'success')
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to raise debit note', 'error')
    } finally {
      setSavingStatus(false)
    }
  }

  const downloadPdf = async () => {
    if (!note || !accessToken) return
    setDownloadingPdf(true)
    try {
      const response = await fetch(`/api/cust-debit-notes/${note.id}/download-pdf`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || 'Failed to download debit note PDF')
      }
      const url = URL.createObjectURL(await response.blob())
      const link = window.document.createElement('a')
      link.href = url
      link.download = `${note.debit_note_number}.pdf`
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      addToast('Debit note PDF downloaded.', 'success')
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to download debit note PDF', 'error')
    } finally {
      setDownloadingPdf(false)
    }
  }

  const sendEmail = async () => {
    if (!note || !accessToken) return
    setSendingEmail(true)
    try {
      const response = await fetch(`/api/cust-debit-notes/${note.id}/send-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Failed to email debit note')
      addToast(data?.message || 'Debit note emailed to customer.', 'success')
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to email debit note', 'error')
    } finally {
      setSendingEmail(false)
    }
  }

  const openNewItem = () => {
    setEditingItemId(null)
    setItemForm(emptyItem)
    setItemModalOpen(true)
  }

  const openEditItem = (item: DebitNoteItem) => {
    setEditingItemId(item.id)
    setItemForm({
      item_name: item.item_name || '',
      item_description: item.item_description || '',
      item_amount: String(item.item_amount ?? ''),
      quantity: String(item.quantity ?? 1),
      is_taxable: Boolean(item.is_taxable),
      tax_id: item.tax_id ? String(item.tax_id) : '',
      tax_item_name: item.tax_item_name || '',
      item_type: item.item_type || 'percent',
      item_value: item.item_value !== null ? String(item.item_value) : '',
      custom_note: item.custom_note || '',
    })
    setItemModalOpen(true)
  }

  const saveItem = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!note || !accessToken) return
    setSavingItem(true)
    const selectedTax = taxes.find((tax) => String(tax.id) === itemForm.tax_id)
    const payload = {
      ...(editingItemId ? { id: editingItemId } : { debit_note_id: note.id }),
      item_name: itemForm.item_name.trim(),
      item_description: itemForm.item_description.trim(),
      item_amount: Number(itemForm.item_amount),
      quantity: Number(itemForm.quantity),
      is_taxable: itemForm.is_taxable,
      tax_id: itemForm.is_taxable && itemForm.tax_id ? Number(itemForm.tax_id) : null,
      tax_item_name: itemForm.is_taxable ? (selectedTax?.name || itemForm.tax_item_name || null) : null,
      item_type: itemForm.item_type,
      item_value: itemForm.is_taxable ? Number(itemForm.item_value || 0) : null,
      custom_note: itemForm.custom_note.trim(),
    }
    try {
      const response = await fetch(
        editingItemId ? '/api/cust-debit-note-items/update' : '/api/cust-debit-note-items/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      )
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Failed to save line item')
      setItemModalOpen(false)
      await loadNote()
      addToast(editingItemId ? 'Line item updated.' : 'Line item added.', 'success')
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to save line item', 'error')
    } finally {
      setSavingItem(false)
    }
  }

  const deleteItem = async (item: DebitNoteItem) => {
    if (!accessToken || !window.confirm(`Remove "${item.item_name}" from this debit note?`)) return
    try {
      const response = await fetch('/api/cust-debit-note-items/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: item.id }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Failed to remove line item')
      await loadNote()
      addToast('Line item removed.', 'success')
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to remove line item', 'error')
    }
  }

  const uploadDocument = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!note || !accessToken || !documentFile) return
    setUploadingDocument(true)
    try {
      const formData = new FormData()
      formData.append('debit_note_id', String(note.id))
      formData.append('document_name', documentFile.name)
      formData.append('document_file', documentFile)
      const response = await fetch('/api/cust-debit-note-documents', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || 'Failed to upload document')
      setDocumentFile(null)
      await loadNote()
      addToast('Document uploaded.', 'success')
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to upload document', 'error')
    } finally {
      setUploadingDocument(false)
    }
  }

  const downloadDocument = async (document: DebitNoteDocument) => {
    if (!accessToken) return
    try {
      const response = await fetch(`/api/cust-debit-note-documents/${document.id}/download`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || 'Failed to download document')
      }
      const url = URL.createObjectURL(await response.blob())
      const link = window.document.createElement('a')
      link.href = url
      link.download = document.document_name || document.document_path.split('/').pop() || 'document'
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to download document', 'error')
    }
  }

  const deleteDocument = async (document: DebitNoteDocument) => {
    if (!accessToken || !window.confirm(`Delete "${document.document_name}"?`)) return
    setDeletingDocumentId(document.id)
    try {
      const response = await fetch(`/api/cust-debit-note-documents/${document.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || 'Failed to delete document')
      }
      await loadNote()
      addToast('Document deleted.', 'success')
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to delete document', 'error')
    } finally {
      setDeletingDocumentId(null)
    }
  }

  const money = (amount: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: note?.currency || 'KES' }).format(Number(amount || 0))

  return (
    <AuthenticatedLayout>
      <Can any={['ROLE_VIEW_CUST_DEBIT_NOTE']} fallback={<div>You do not have permission to view customer debit notes.</div>}>
        <ToastContainer toasts={toasts} onClose={removeToast} />
        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading debit note…</div>
        ) : !note ? (
          <div className="py-12 text-center">
            <p className="font-medium">Debit note not found.</p>
            <Link href="/cust-invoices/debit-notes" className="mt-3 inline-block text-primary-500 hover:underline">Back to debit notes</Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <Link href="/cust-invoices/debit-notes" className="mb-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-500">
                  <span className="material-symbols-outlined text-base">arrow_back</span> Debit notes
                </Link>
                <h5 className="!mb-1">{note.title || 'Customer Debit Note'}</h5>
                <p className="text-sm text-gray-500">{note.debit_note_number} · Invoice {note.invoice?.invoice_number || note.invoice_id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded px-3 py-1.5 text-sm capitalize ${note.status === 'raised' ? 'bg-info-50 text-info-600' : 'bg-warning-50 text-warning-600'}`}>{note.status}</span>
                <button type="button" onClick={downloadPdf} disabled={downloadingPdf} className="rounded-md border border-gray-200 px-3 py-2 text-sm disabled:opacity-50 dark:border-[#172036]">
                  {downloadingPdf ? 'Preparing PDF…' : 'Download PDF'}
                </button>
                <button type="button" onClick={sendEmail} disabled={sendingEmail || note.status !== 'raised'} title={note.status !== 'raised' ? 'Raise the debit note before emailing it.' : undefined} className="rounded-md border border-gray-200 px-3 py-2 text-sm disabled:opacity-50 dark:border-[#172036]">
                  {sendingEmail ? 'Sending…' : 'Email customer'}
                </button>
                {note.status === 'draft' && (
                  <>
                    <Can any={['ROLE_EDIT_CUST_DEBIT_NOTE']}>
                      <button type="button" onClick={() => {
                        setTitle(note.title || '')
                        setDescription(note.description || '')
                        setCustomerNotes(note.notes_to_customer || '')
                        setEditingHeader(true)
                      }} className="rounded-md border border-gray-200 px-3 py-2 text-sm dark:border-[#172036]">Edit details</button>
                    </Can>
                    <Can any={['ROLE_EDIT_CUST_DEBIT_NOTE']}>
                      <button type="button" onClick={changeStatus} disabled={savingStatus || note.items.length === 0} className="rounded-md bg-primary-500 px-3 py-2 text-sm text-white disabled:opacity-50">
                        {savingStatus ? 'Raising…' : 'Raise debit note'}
                      </button>
                    </Can>
                  </>
                )}
              </div>
            </div>

            <div className="mb-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <section className="rounded-md bg-white p-5 shadow-sm dark:bg-[#0c1427]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h6 className="font-semibold">Line items</h6>
                    <p className="text-xs text-gray-500">Amounts and tax are recalculated from the saved items.</p>
                  </div>
                  {note.status === 'draft' && (
                    <Can any={['ROLE_ADD_CUST_DEBIT_NOTE_ITEM']}>
                      <button type="button" onClick={openNewItem} className="rounded-md bg-primary-500 px-3 py-2 text-sm text-white">Add line item</button>
                    </Can>
                  )}
                </div>
                {note.items.length === 0 ? (
                  <div className="rounded-md border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500 dark:border-[#172036]">No line items added yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px]">
                      <thead><tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-500 dark:border-[#172036]">
                        <th className="px-2 py-3">Description</th><th className="px-2 py-3 text-right">Unit price</th><th className="px-2 py-3 text-right">Qty</th><th className="px-2 py-3 text-right">Tax</th><th className="px-2 py-3 text-right">Line total</th><th className="px-2 py-3"></th>
                      </tr></thead>
                      <tbody>
                        {note.items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-50 last:border-0 dark:border-[#172036]">
                            <td className="px-2 py-3">
                              <div className="font-medium">{item.item_name}</div>
                              {item.item_description && <div className="mt-0.5 text-xs text-gray-500">{item.item_description}</div>}
                              {item.is_taxable && <div className="mt-1 text-xs text-gray-400">{item.tax_item_name || 'Tax'} · {item.item_type === 'percent' ? `${item.item_value}%` : money(item.item_value || 0)}</div>}
                            </td>
                            <td className="px-2 py-3 text-right">{money(item.item_amount)}</td>
                            <td className="px-2 py-3 text-right">{item.quantity}</td>
                            <td className="px-2 py-3 text-right">{money(item.tax_amount)}</td>
                            <td className="px-2 py-3 text-right font-medium">{money(item.total + item.tax_amount)}</td>
                            <td className="px-2 py-3 text-right">
                              {note.status === 'draft' && (
                                <div className="flex justify-end gap-2">
                                  <Can any={['ROLE_EDIT_CUST_DEBIT_NOTE_ITEM']}><button type="button" onClick={() => openEditItem(item)} className="text-xs text-primary-500 hover:underline">Edit</button></Can>
                                  <Can any={['ROLE_DELETE_CUST_DEBIT_NOTE_ITEM']}><button type="button" onClick={() => deleteItem(item)} className="text-xs text-danger-500 hover:underline">Remove</button></Can>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="ml-auto mt-5 w-full max-w-xs space-y-2 border-t border-gray-100 pt-4 text-sm dark:border-[#172036]">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{money(note.subtotal_amount)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{money(note.tax_amount)}</span></div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold dark:border-[#172036]"><span>Total due</span><span>{money(note.total_amount)}</span></div>
                </div>
              </section>

              <aside className="space-y-5">
                <section className="rounded-md bg-white p-5 shadow-sm dark:bg-[#0c1427]">
                  <h6 className="mb-3 font-semibold">Invoice details</h6>
                  {note.invoice && <Link href={`/cust-invoices/${note.invoice.id}`} className="font-medium text-primary-500 hover:underline">{note.invoice.invoice_number}</Link>}
                  <p className="mt-1 text-sm text-gray-500">{note.invoice?.title || 'Customer invoice'}</p>
                  <p className="mt-3 text-sm">{note.invoice?.customer?.name || 'Customer'}</p>
                  {note.invoice?.status && <p className="mt-1 text-xs capitalize text-gray-500">Invoice status: {note.invoice.status}</p>}
                </section>
                <section className="rounded-md bg-white p-5 shadow-sm dark:bg-[#0c1427]">
                  <h6 className="mb-3 font-semibold">Customer notes</h6>
                  <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">{note.notes_to_customer || 'No customer notes.'}</p>
                </section>
              </aside>
            </div>

            <section className="rounded-md bg-white p-5 shadow-sm dark:bg-[#0c1427]">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h6 className="font-semibold">Supporting documents</h6>
                  <p className="text-xs text-gray-500">Attach evidence or calculations for this debit note.</p>
                </div>
                {note.status === 'draft' && (
                  <Can any={['ROLE_ADD_CUST_DEBIT_NOTE_DOCUMENT']}>
                    <form onSubmit={uploadDocument} className="flex flex-wrap items-center gap-2">
                      <input type="file" required accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" onChange={(event) => setDocumentFile(event.target.files?.[0] || null)} className="max-w-[250px] text-xs" />
                      <button type="submit" disabled={!documentFile || uploadingDocument} className="rounded-md border border-gray-200 px-3 py-2 text-xs disabled:opacity-50 dark:border-[#172036]">
                        {uploadingDocument ? 'Uploading…' : 'Upload'}
                      </button>
                    </form>
                  </Can>
                )}
              </div>
              {note.documents.length === 0 ? (
                <p className="rounded-md border border-dashed border-gray-200 py-8 text-center text-sm text-gray-500 dark:border-[#172036]">No documents attached.</p>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-[#172036]">
                  {note.documents.map((document) => (
                    <div key={document.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{document.document_name || document.document_path.split('/').pop()}</p>
                        <p className="text-xs text-gray-500">{document.created_at ? new Date(document.created_at).toLocaleDateString() : document.document_path}</p>
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => downloadDocument(document)} className="text-xs text-primary-500 hover:underline">Download</button>
                        {note.status === 'draft' && <Can any={['ROLE_DELETE_CUST_DEBIT_NOTE_DOCUMENT']}><button type="button" disabled={deletingDocumentId === document.id} onClick={() => deleteDocument(document)} className="text-xs text-danger-500 hover:underline">Delete</button></Can>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {editingHeader && note && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
            <form onSubmit={saveHeader} className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl dark:bg-[#0c1427]">
              <h6 className="mb-4 font-semibold">Edit debit note details</h6>
              <label className="mb-3 block text-sm">Title<input required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" maxLength={255} /></label>
              <label className="mb-3 block text-sm">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" rows={3} /></label>
              <label className="mb-5 block text-sm">Notes to customer<textarea value={customerNotes} onChange={(event) => setCustomerNotes(event.target.value)} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" rows={3} /></label>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditingHeader(false)} className="rounded-md border border-gray-200 px-4 py-2 text-sm dark:border-[#172036]">Cancel</button>
                <button type="submit" disabled={savingHeader} className="rounded-md bg-primary-500 px-4 py-2 text-sm text-white disabled:opacity-50">{savingHeader ? 'Saving…' : 'Save changes'}</button>
              </div>
            </form>
          </div>
        )}

        {itemModalOpen && note?.status === 'draft' && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true">
            <form onSubmit={saveItem} className="my-6 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-[#0c1427]">
              <h6 className="mb-4 font-semibold">{editingItemId ? 'Edit line item' : 'Add line item'}</h6>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm md:col-span-2">Item name<input required value={itemForm.item_name} onChange={(event) => setItemForm({ ...itemForm, item_name: event.target.value })} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" maxLength={255} /></label>
                <label className="text-sm md:col-span-2">Description<input required value={itemForm.item_description} onChange={(event) => setItemForm({ ...itemForm, item_description: event.target.value })} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" maxLength={255} /></label>
                <label className="text-sm">Unit amount<input required type="number" min="0" step="0.01" value={itemForm.item_amount} onChange={(event) => setItemForm({ ...itemForm, item_amount: event.target.value })} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" /></label>
                <label className="text-sm">Quantity<input required type="number" min="1" step="1" value={itemForm.quantity} onChange={(event) => setItemForm({ ...itemForm, quantity: event.target.value })} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" /></label>
                <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" checked={itemForm.is_taxable} onChange={(event) => {
                  const isTaxable = event.target.checked
                  const defaultTax = taxes.find((tax) => Boolean(tax.is_default)) || taxes[0]
                  setItemForm({ ...itemForm, is_taxable: isTaxable, tax_id: isTaxable && defaultTax ? String(defaultTax.id) : '' })
                }} /> Taxable item</label>
                {itemForm.is_taxable && (
                  <>
                    <label className="text-sm md:col-span-2">Tax<select required value={itemForm.tax_id} onChange={(event) => {
                      const selected = taxes.find((tax) => String(tax.id) === event.target.value)
                      setItemForm({ ...itemForm, tax_id: event.target.value, tax_item_name: selected?.name || '' })
                    }} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]"><option value="">Select tax</option>{taxes.map((tax) => <option key={tax.id} value={tax.id}>{tax.name} ({tax.rate}%)</option>)}</select></label>
                    <label className="text-sm">Tax calculation<select value={itemForm.item_type} onChange={(event) => setItemForm({ ...itemForm, item_type: event.target.value as 'fixed' | 'percent' })} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]"><option value="percent">Percentage</option><option value="fixed">Fixed amount</option></select></label>
                    <label className="text-sm">{itemForm.item_type === 'percent' ? 'Tax rate (%)' : 'Tax amount'}<input required type="number" min="0" step="0.01" value={itemForm.item_value} onChange={(event) => setItemForm({ ...itemForm, item_value: event.target.value })} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" /></label>
                  </>
                )}
                <label className="text-sm md:col-span-2">Line note<input required value={itemForm.custom_note} onChange={(event) => setItemForm({ ...itemForm, custom_note: event.target.value })} className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 dark:border-[#172036]" maxLength={255} /></label>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setItemModalOpen(false)} className="rounded-md border border-gray-200 px-4 py-2 text-sm dark:border-[#172036]">Cancel</button>
                <button type="submit" disabled={savingItem} className="rounded-md bg-primary-500 px-4 py-2 text-sm text-white disabled:opacity-50">{savingItem ? 'Saving…' : 'Save line item'}</button>
              </div>
            </form>
          </div>
        )}
      </Can>
    </AuthenticatedLayout>
  )
}

export default CustomerDebitNoteDetailPage
