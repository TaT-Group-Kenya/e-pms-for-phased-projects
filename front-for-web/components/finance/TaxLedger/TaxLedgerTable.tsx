"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../../store/auth/selectors"
import { useToast } from "../../../hooks/useToast"
import { ToastContainer } from "../../../components/common/Toast"

interface TaxLedgerRow {
  id: number
  transaction_number: string
  side: string
  direction: string
  chart_code?: string
  chart_name?: string
  amount: number
  converted_amount: number
  transaction_currency?: string | null
  transaction_date?: string
  source_type?: string | null
  source_id?: number | null
  narration?: string | null
  tax?: { id: number; code: string; name: string; rate: number } | null
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface SummaryRow {
  direction: string
  chart_of_account: number
  chart?: { id: number; code: string; name: string } | null
  total: number
  entries: number
}

const fmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const chip = (kind: string) => {
  if (kind === "collected")
    return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300"
  if (kind === "paid")
    return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300"
  if (kind === "opened")
    return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
  if (kind === "uncollected")
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300"
  return "bg-gray-100 text-gray-700 dark:bg-[#111827] dark:text-gray-300"
}

const TaxLedgerTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const [rows, setRows] = useState<TaxLedgerRow[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [summary, setSummary] = useState<SummaryRow[]>([])
  const [page, setPage] = useState(1)
  const [direction, setDirection] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchPage = useCallback(
    async (targetPage = 1) => {
      if (!accessToken) {
        setRows([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(targetPage), per_page: "15" })
        if (direction) params.set("direction", direction)

        const [rowsResp, summaryResp] = await Promise.all([
          fetch(`/api/tax-transactions?${params.toString()}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch(`/api/tax-transactions/summary`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ])

        const rowsData: any = await rowsResp.json().catch(() => null)
        const summaryData: any = await summaryResp.json().catch(() => null)

        if (!rowsResp.ok) {
          addToast(rowsData?.message || "Failed to load tax ledger", "error")
          setRows([])
        } else {
          setRows(Array.isArray(rowsData?.data) ? rowsData.data : [])
          setMeta(rowsData?.meta ?? null)
        }
        setSummary(Array.isArray(summaryData?.data) ? summaryData.data : [])
      } catch {
        addToast("Error loading tax ledger.", "error")
        setRows([])
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken, direction, page],
  )

  useEffect(() => {
    fetchPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, direction])

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Position summary */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] p-5 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[15px]">
          {(summary.length > 0
            ? summary
            : [
                { label: "collected", chart: { code: "2000", name: "Liabilities" }, total: 0, entries: 0 },
                { label: "uncollected", chart: { code: "2000", name: "Liabilities" }, total: 0, entries: 0 },
                { label: "paid", chart: { code: "1000", name: "Assets" }, total: 0, entries: 0 },
              ]
          ).map((row: any) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50 dark:bg-[#081328]"
            >
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  Tax {row.label} ({row.chart?.code ?? "-"} {row.chart?.name ?? ""})
                </div>
                <div className="text-sm font-semibold text-black dark:text-white">
                  KES {fmt.format(Number(row.total ?? 0))}
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-medium ${chip(row.label)}`}>
                {row.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-[10px] text-[11px] text-gray-500 dark:text-gray-400">
          Net VAT position = collected (payable) − paid (recoverable).
        </p>
      </div>

      {/* Filters */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[20px] p-5 rounded-md">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium mb-[5px]">Direction</label>
            <select
              value={direction}
              onChange={(e) => {
                setDirection(e.target.value)
                setPage(1)
              }}
              className="px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
            >
              <option value="">All</option>
              <option value="collected">Collected</option>
              <option value="paid">Paid</option>
              <option value="adjusted">Adjusted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rows table */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Txn #</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Date</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Direction</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Chart</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Tax</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Source</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Amount (KES)</th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center text-sm px-[10px] py-[10px]">Loading...</td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-sm px-[10px] py-[16px] text-gray-500">
                    No tax ledger entries yet.
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]">
                    <td className="text-sm px-[10px] py-[6px] font-medium">{row.transaction_number}</td>
                    <td className="text-sm px-[10px] py-[6px]">{row.transaction_date ?? "-"}</td>
                    <td className="text-sm px-[10px] py-[6px]">
                      <span className={`inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-medium ${chip(row.side === "dr" ? "opened" : row.direction)}`}>
                        {row.side === "dr" ? "opened" : row.direction}
                      </span>
                    </td>
                    <td className="text-sm px-[10px] py-[6px]">
                      {row.chart_code && row.chart_name ? `${row.chart_code} - ${row.chart_name}` : "-"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px]">
                      {row.tax ? `${row.tax.code} (${row.tax.rate}%)` : "—"}
                    </td>
                    <td className="text-sm px-[10px] py-[6px]">
                      {row.source_type ?? "—"}
                      {row.source_id ? ` #${row.source_id}` : ""}
                    </td>
                    <td className="text-sm px-[10px] py-[6px] text-right font-medium">
                      {fmt.format(Number(row.converted_amount ?? 0))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {meta && (
          <div className="flex items-center justify-between px-[10px] py-[10px] text-sm">
            <span className="text-gray-500">
              Page {meta.current_page} of {meta.last_page} · {meta.total} entries
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
    </>
  )
}

export default TaxLedgerTable
