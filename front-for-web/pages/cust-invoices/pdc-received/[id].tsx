import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'
import React, { useEffect, useState } from 'react'
import Can from '../../../components/auth/Can'
import { useSelector } from 'react-redux'
import { selectAccessToken } from '../../../store/auth/selectors'
import { useRouter } from 'next/router'
import { useToast } from '../../../hooks/useToast'

export default function PdcReceivedDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const [item, setItem] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editAmount, setEditAmount] = useState('')
  const [editChequeDate, setEditChequeDate] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      if (!id || !accessToken) return
      setLoading(true)
      try {
        const resp = await fetch(`/api/pdc-received/${id}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data = await resp.json().catch(() => null)
        if (!resp.ok) throw new Error(data?.message || 'Failed to load')
        const payload = data?.data || data
        setItem(payload)
      } catch (err: any) {
        addToast(err?.message || 'Failed to load PDC', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id, accessToken, addToast])

  const handlePostToAccounts = async () => {
    if (!item || !accessToken) return
    setPosting(true)
    try {
      const resp = await fetch('/api/pdc-received/post-to-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ id: item.id }),
      })
      const data = await resp.json().catch(() => null)
      if (!resp.ok) throw new Error(data?.message || 'Failed to post')
      addToast('Posted to accounts', 'success')
      // refresh
      setItem((prev: any) => ({ ...prev, status: 'posted' }))
    } catch (err: any) {
      addToast(err?.message || 'Failed to post to accounts', 'error')
    } finally {
      setPosting(false)
    }
  }

  const canPost = (() => {
    if (!item || !item.cheque_date) return false
    const cheque = new Date(item.cheque_date)
    const today = new Date()
    cheque.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return cheque <= today && item.status !== 'posted'
  })()

  const matured = (() => {
    if (!item || !item.cheque_date) return false
    const cheque = new Date(item.cheque_date)
    const today = new Date()
    cheque.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return cheque <= today
  })()

  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_PDC_RECEIVED_CUSTOMER"]} fallback={<div>You do not have permission to view this PDC.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
          <div>
            <h5 className="!mb-1">PDC Received</h5>
            <p className="text-sm text-gray-500">PDC #{item?.transaction_number || ''}</p>
          </div>

          <ol className="breadcrumb mt-[12px] md:mt-0">
            <li className="breadcrumb-item inline-block text-sm"><a href="/dashboard">Dashboard {">"}</a></li>
            <li className="breadcrumb-item inline-block text-sm ml-3">PDC Received</li>
          </ol>
        </div>

        <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
          <div className="flex items-start md:items-center justify-between gap-[20px]">
            <div>
              <h4 className="text-black dark:text-white text-xl font-semibold mb-[6px]">{item?.transaction_number || 'PDC'}</h4>
              <p className="text-sm text-gray-500">{item?.narration || ''}</p>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => router.back()} className="inline-flex items-center justify-center rounded-md font-medium px-[13px] py-[6px] text-gray-500 border border-gray-200 hover:bg-gray-50">Back</button>
              <button type="button" onClick={() => {
                setEditAmount(item?.amount ? String(item.amount) : '')
                setEditChequeDate(item?.cheque_date || '')
                setEditing(true)
              }} className="inline-flex items-center justify-center rounded-md font-medium px-[13px] py-[6px] text-gray-500 border border-gray-200 hover:bg-gray-50">Edit</button>
              {item?.status === 'posted' ? (
                <span className="inline-flex items-center px-3 py-1 rounded bg-success-50 text-success-600">Posted</span>
              ) : matured ? (
                <button
                  type="button"
                  disabled={posting}
                  onClick={handlePostToAccounts}
                  className="inline-flex items-center justify-center rounded-md px-[13px] py-[6px] bg-primary-500 text-white"
                >
                  {posting ? 'Posting...' : 'Post to Accounts'}
                </button>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded bg-yellow-50 text-yellow-700">Pending</span>
              )}
            </div>
          </div>
        </div>

        <div className="trezo-card bg-white p-[20px] rounded-md">
          {loading ? (
            <div>Loading...</div>
          ) : !item ? (
            <div>Not found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="text-sm text-gray-500 font-semibold">Invoice</div>
                  <div className="mt-1">
                    {item.invoice ? (
                      <a href={`/cust-invoices/${item.invoice.id}`} className="text-primary-500 font-medium">{item.invoice.invoice_number}</a>
                    ) : (
                      <span>{item.invoice_number || '-'}</span>
                    )}
                  </div>
                  {item.invoice?.title && <div className="text-sm text-gray-500 mt-2">{item.invoice.title}</div>}
                </div>

                <div className="p-4 border rounded-md">
                  <div className="text-sm text-gray-500 font-semibold">Customer</div>
                  <div className="mt-1 font-medium">{item.customer ? item.customer.name : item.customer_name || '-'}</div>
                  {item.customer?.email && <div className="text-sm text-gray-500 mt-1">{item.customer.email}</div>}
                  {item.customer?.phone && <div className="text-sm text-gray-500">{item.customer.phone}</div>}
                </div>

                <div className="p-4 border rounded-md">
                  <div className="text-sm text-gray-500 font-semibold">Bank Account</div>
                  <div className="mt-1">{item.bank_account ? `${item.bank_account.code} — ${item.bank_account.name}` : (item.bank || '-')}</div>
                  {item.bank_branch && <div className="text-sm text-gray-500 mt-1">Branch: {item.bank_branch}</div>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="text-sm text-gray-500 font-semibold">PDC Details</div>
                  <div className="mt-1">Cheque No: <span className="font-medium">{item.cheque_number || '-'}</span></div>
                  <div className="mt-1">Cheque Date: <span className="font-semibold text-primary-600">{item.cheque_date || '-'}</span></div>
                  <div className="mt-1">Amount: <span className="font-medium">{item.amount || '-'}</span></div>
                  <div className="mt-1">Status: <span className="font-medium">{item.status || '-'}</span></div>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="text-sm text-gray-500">Metadata</div>
                  <div className="mt-1">Created At: {item.created_at || '-'}</div>
                  <div className="mt-1">Created By: {item.created_by || '-'}</div>
                  <div className="mt-1">Related Transaction: {item.related_transaction_id || '-'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-[20px] w-[90%] max-w-[520px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">Edit PDC</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="number" min="0" step="0.01" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cheque Date</label>
                <input type="date" value={editChequeDate} onChange={(e) => setEditChequeDate(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
              </div>

              <div className="flex gap-2 mt-2">
                <button type="button" onClick={async () => {
                  if (!item) return
                  const amt = Number(editAmount)
                  if (Number.isNaN(amt) || amt <= 0) { addToast('Enter a valid amount', 'error'); return }
                  if (editChequeDate) {
                    const today = new Date().toISOString().slice(0,10)
                    if (editChequeDate < today) { addToast('Cheque date cannot be in the past.', 'error'); return }
                  }
                  setSavingEdit(true)
                  try {
                    const resp = await fetch(`/api/pdc-received/${item.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                      body: JSON.stringify({ amount: amt, cheque_date: editChequeDate || null })
                    })
                    const data = await resp.json().catch(() => null)
                    if (!resp.ok) throw new Error(data?.message || 'Failed to save')
                    addToast('PDC updated', 'success')
                    // refresh item
                    setItem(data?.data || data)
                    setEditing(false)
                  } catch (err: any) {
                    addToast(err?.message || 'Failed to update PDC', 'error')
                  } finally {
                    setSavingEdit(false)
                  }
                }} disabled={savingEdit} className="px-3 py-2 text-sm rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">{savingEdit ? 'Saving…' : 'Save Changes'}</button>
                <button type="button" onClick={() => setEditing(false)} disabled={savingEdit} className="px-3 py-2 text-sm rounded border border-gray-200 hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      </Can>
    </AuthenticatedLayout>
  )
}
