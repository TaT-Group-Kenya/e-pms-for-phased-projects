"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import { selectAccessToken } from "../../../store/auth/selectors"
import { useToast } from "../../../hooks/useToast"
import { ToastContainer } from "../../../components/common/Toast"
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal/DeleteConfirmationModal"
import { formatApiError } from "../../../utils/errorHandler"

interface TrialBalanceRun {
  id: number
  run_number: string
  as_at_date: string
  forex_rate: number
  base_currency: string
  created_at: string
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface ChartLine {
  id: number
  chart_code: string
  chart_name: string
  account_name: string
  category: string
  debit_kes: number
  credit_kes: number
  debit_usd: number
  credit_usd: number
}

const fmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const TrialBalanceTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const [runs, setRuns] = useState<TrialBalanceRun[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showRunModal, setShowRunModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<TrialBalanceRun | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formAsAt, setFormAsAt] = useState(new Date().toISOString().slice(0, 10))
  const [formRate, setFormRate] = useState("128.45")


  const fetchRuns = useCallback(
    async (targetPage = 1) => {
      if (!accessToken) {
        setRuns([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(targetPage), per_page: "15" })
        if (from) params.set("from", from)
        if (to) params.set("to", to)

        const resp = await fetch(`/api/trial-balance?${params.toString()}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data: any = await resp.json().catch(() => null)
        if (!resp.ok) {
          addToast(data?.message || "Failed to load trial balance runs", "error")
          setRuns([])
          return
        }
        setRuns(Array.isArray(data?.data) ? data.data : [])
        setMeta(data?.meta ?? data?.pagination ?? null)
      } catch {
        addToast("Error loading trial balance runs.", "error")
        setRuns([])
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken, from, to, page],
  )

  useEffect(() => {
    fetchRuns(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleRequestDelete = (run: TrialBalanceRun) => {
    setDeleteTarget(run)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !accessToken) {
      addToast("You are not authenticated.", "error")
      return
    }

    setDeleting(true)
    try {
      const resp = await fetch(`/api/trial-balance/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        addToast(formatApiError(data) || "Failed to delete this run.", "error")
        return
      }
      addToast(`Trial balance run ${deleteTarget.run_number} deleted.`, "success")
      setShowDeleteModal(false)
      setDeleteTarget(null)
      await fetchRuns(page)
    } catch {
      addToast("Failed to delete this run.", "error")
    } finally {
      setDeleting(false)
    }
  }

  const openRunModal = () => {
    setFormAsAt(new Date().toISOString().slice(0, 10))
    setFormRate("128.45")
    setShowRunModal(true)
  }

  const handleGenerate = async () => {
    if (!accessToken) {
      addToast("You are not authenticated.", "error")
      return
    }

    const rate = Number(formRate)
    if (!rate || rate <= 0) {
      addToast("Please enter a valid forex rate greater than zero.", "error")
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formAsAt)) {
      addToast("Please enter a valid as-at date.", "error")
      return
    }

    setGenerating(true)
    try {
      const resp = await fetch("/api/trial-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ as_at_date: formAsAt, forex_rate: rate }),
      })
      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        addToast(data?.message || "Failed to generate trial balance.", "error")
        return
      }
      addToast(`Trial balance generated (${data?.data?.run_number}).`, "success")
      setShowRunModal(false)
      setPage(1)
      await fetchRuns(1)
    } catch {
      addToast("Failed to generate trial balance.", "error")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] p-5 rounded-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[15px]">
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white">Trial Balance</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Stored snapshots of the books as at a date. Each run keeps the USD→KES rate used.
            </p>
          </div>
          <button
            type="button"
            onClick={openRunModal}
            disabled={generating}
            className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-60"
          >
            {generating ? "Generating..." : "Run Trial Balance"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium mb-[5px]">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-[5px]">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setPage(1)
              fetchRuns(1)
            }}
            className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium"
          >
            Filter
          </button>
          {(from || to) && (
            <button
              type="button"
              onClick={() => {
                setFrom("")
                setTo("")
                setPage(1)
              }}
              className="px-[12px] py-[8px] rounded-md text-sm text-gray-500"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Runs list */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead className="text-black dark:text-white">
                <tr>
                  <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Run #</th>
                  <th className="font-medium ltr:left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Forex rate (USD to KES)</th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Date time</th>
                  <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">As at</th>
                  <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {loading && (
                  <tr>
                    <td colSpan={5} className="text-center text-sm px-[10px] py-[10px]">Loading...</td>
                  </tr>
                )}
                {!loading && runs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-sm px-[10px] py-[16px] text-gray-500">
                      No trial balance runs yet. Click "Run Trial Balance" to generate one.
                    </td>
                  </tr>
                )}
                {!loading &&
                  runs.map((run) => (
                    <tr key={run.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]">
                      <td className="text-sm px-[10px] py-[6px] font-medium">{run.run_number}</td>
                      <td className="text-sm px-[10px] py-[6px]">{run.forex_rate}</td>
                      <td className="text-sm px-[10px] py-[6px]">{new Date(run.created_at).toLocaleString()}</td>
                      <td className="text-sm px-[10px] py-[6px]">{run.as_at_date}</td>
                      <td className="text-sm px-[10px] py-[6px] text-right">
                        <Link
                          href={`/finance/trial-balance/${run.id}`}
                          className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium mr-2"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(run)}
                          className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-danger-200 text-xs font-medium text-danger-600 hover:bg-danger-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {meta && (
            <div className="flex items-center justify-between px-[10px] py-[10px] text-sm">
              <span className="text-gray-500">
                Page {meta.current_page} of {meta.last_page} · {meta.total} runs
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={meta.current_page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-[10px] py-[4px] rounded-md border border-gray-200 dark:border-[#172036] disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-[10px] py-[4px] rounded-md border border-gray-200 dark:border-[#172036] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Trial Balance Run"
        message={
          deleteTarget
            ? `Are you sure you want to delete run ${deleteTarget.run_number} (as at ${deleteTarget.as_at_date})? It will be hidden from all lists and reports.`
            : "Are you sure you want to delete this trial balance run?"
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={deleting}
      />

      {/* Run configuration modal (as-at date + FX rate) */}
      {showRunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-md p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[10px]">
              Run Trial Balance
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-[16px]">
              A new snapshot of the books will be stored permanently. KES entries are reported as-is;
              USD entries are translated at the rate below.
            </p>

            <div className="space-y-[12px] mb-[18px]">
              <div>
                <label className="block text-xs font-medium mb-[5px]">As at date</label>
                <input
                  type="date"
                  value={formAsAt}
                  onChange={(e) => setFormAsAt(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-[5px]">Forex rate (USD to KES)</label>
                <input
                  type="number"
                  min="0.000001"
                  step="0.0001"
                  value={formRate}
                  onChange={(e) => setFormRate(e.target.value)}
                  className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-[4px] text-[11px] text-gray-500 dark:text-gray-400">
                  e.g. 128.45 means 1 USD = 128.45 KES.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRunModal(false)}
                disabled={generating}
                className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="px-[13px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-60"
              >
                {generating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TrialBalanceTable
