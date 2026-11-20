"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import { selectAccessToken } from "../../store/auth/selectors"
import { useToast } from "../../hooks/useToast"
import { ToastContainer } from "../../components/common/Toast"
import AuthenticatedLayout from "../../components/authenticated/AuthenticatedLayout"
import Can from "../../components/auth/Can"

interface LoansReportRow {
  disbursement_date?: string
  lender_name?: string
  currency?: string
  amount_loaned?: number
  total_interest?: number
  total_due?: number
  total_paid?: number
  balance?: number
  status?: string
}

interface LoansTotals {
  amount_loaned?: number
  total_interest?: number
  total_due?: number
  total_paid?: number
  balance?: number
  currency?: string
}

interface LenderOption {
  id: number
  name: string
}

interface CurrencyOption {
  id: number
  code: string
}

const fmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const LoansReportPage: React.FC = () => {
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const [lenderOptions, setLenderOptions] = useState<LenderOption[]>([])
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([])
  const [filters, setFilters] = useState({
    lender_id: "",
    currency_code: "",
    from_date: "",
    to_date: "",
  })
  const [rows, setRows] = useState<LoansReportRow[]>([])
  const [totals, setTotals] = useState<LoansTotals>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasRun, setHasRun] = useState(false)

  useEffect(() => {
    if (!accessToken) return
    let isMounted = true

    Promise.all([
      fetch("/api/currencies/list", { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((r) => r.json().then((j) => ({ ok: r.ok, data: Array.isArray(j.data) ? j.data : j })))
        .catch(() => ({ ok: false, data: null })),
      fetch("/api/lenders?per_page=100", { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((r) => r.json().then((j) => ({ ok: r.ok, data: Array.isArray(j.data) ? j.data : j })))
        .catch(() => ({ ok: false, data: null })),
    ]).then(([currencies, lenders]) => {
      if (!isMounted) return
      if (currencies.ok && Array.isArray(currencies.data)) {
        setCurrencyOptions(currencies.data)
        if (!filters.currency_code && currencies.data.length > 0) {
          const first = currencies.data[0]
          const code = first.code || first.id
          if (code) setFilters((prev) => ({ ...prev, currency_code: code }))
        }
      }
      if (lenders.ok && Array.isArray(lenders.data)) setLenderOptions(lenders.data)
    })

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  const fetchData = async () => {
    setLoading(true)
    setError("")
    setHasRun(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      const resp = await fetch(`/api/reports/loans-report?${params.toString()}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        setError(data?.error || data?.message || "Failed to fetch loans report")
        setRows([])
        setTotals({})
        return
      }
      setRows(Array.isArray(data?.data) ? data.data : [])
      setTotals(data?.totals ?? {})
    } catch {
      setError("Network error fetching loans report")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExport = async (type: "pdf" | "csv") => {
    if (type === "csv") {
      exportCsv()
      return
    }
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      params.append("reportType", "loansReport")
      const url = `/api/reports/export-pdf?${params.toString()}`
      const resp = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!resp.ok) {
        const err = await resp.json().catch(() => null)
        addToast(err?.error || err?.message || "Failed to export PDF", "error")
        return
      }
      const blob = await resp.blob()
      downloadBlob(blob, "loans-report.pdf")
    } catch {
      addToast("Network error exporting PDF", "error")
    }
  }

  function exportCsv() {
    const columns = [
      "Date",
      "Lender",
      "Amount Loaned",
      "Total Interest",
      "Total Due",
      "Total Paid",
      "Balance",
    ]
    const rowsData = rows.map((row) => [
      row.disbursement_date ?? "",
      row.lender_name ?? "",
      fmt.format(Number(row.amount_loaned ?? 0)),
      fmt.format(Number(row.total_interest ?? 0)),
      fmt.format(Number(row.total_due ?? 0)),
      fmt.format(Number(row.total_paid ?? 0)),
      fmt.format(Number(row.balance ?? 0)),
    ])
    const totalsData = [
      "TOTAL",
      "",
      fmt.format(Number(totals.amount_loaned ?? 0)),
      fmt.format(Number(totals.total_interest ?? 0)),
      fmt.format(Number(totals.total_due ?? 0)),
      fmt.format(Number(totals.total_paid ?? 0)),
      fmt.format(Number(totals.balance ?? 0)),
    ]

    const csv = [
      columns.join(","),
      ...rowsData.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
      totalsData.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    ].join("\n")

    downloadBlob(new Blob([csv], { type: "text/csv" }), "loans-report.csv")
  }

  return (
    <AuthenticatedLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Can
        any={["ROLE_VIEW_LOAN"]}
        fallback={<div>You do not have permission to view this report.</div>}
      >
        {/* Card 1: Title & Export */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between">
            <h5 className="!mb-0">Loans Report</h5>
            <div className="flex gap-2">
              <button
                className="rounded-full bg-transparent text-primary-500 px-4 py-2 flex items-center gap-2 hover:bg-primary-50 transition"
                onClick={() => handleExport("pdf")}
              >
                <i className="material-symbols-outlined !text-xl text-primary-500">picture_as_pdf</i> Export PDF
              </button>
              <button
                className="rounded-full bg-transparent text-success-500 px-4 py-2 flex items-center gap-2 hover:bg-success-50 transition"
                onClick={() => handleExport("csv")}
              >
                <i className="material-symbols-outlined !text-xl text-success-500">table</i> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Filters */}
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label htmlFor="currency_code" className="mb-1 text-sm text-gray-600">Currency <span className="text-danger-500">*</span></label>
              <select
                id="currency_code"
                name="currency_code"
                value={filters.currency_code}
                onChange={handleFilterChange}
                required
                className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
              >
                <option value="">Select currency</option>
                {currencyOptions.map((c) => (
                  <option key={c.id} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="lender_id" className="mb-1 text-sm text-gray-600">Lender</label>
              <select
                id="lender_id"
                name="lender_id"
                value={filters.lender_id}
                onChange={handleFilterChange}
                className="form-select rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
              >
                <option value="">All Lenders</option>
                {lenderOptions.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="from_date" className="mb-1 text-sm text-gray-600">From</label>
              <input
                id="from_date"
                type="date"
                name="from_date"
                value={filters.from_date}
                onChange={handleFilterChange}
                className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="to_date" className="mb-1 text-sm text-gray-600">To</label>
              <input
                id="to_date"
                type="date"
                name="to_date"
                value={filters.to_date}
                onChange={handleFilterChange}
                className="form-input rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 px-4 h-[42px]"
              />
            </div>
          </div>
          <button
            className="px-4 py-2 rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50"
            onClick={fetchData}
            disabled={loading || !filters.currency_code}
          >
            {loading ? "Loading..." : "Run Report"}
          </button>
          {!filters.currency_code && (
            <p className="mt-2 text-xs text-danger-500">
              Currency is required to run the loans report.
            </p>
          )}
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {/* Card 3: Results */}
        {hasRun && (
          <div className="bg-white rounded-lg shadow p-5">
            <div className="table-responsive overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-black dark:bg-gray-700 dark:text-white">
                  <tr>
                    <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Date</th>
                    <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Lender</th>
                    <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Amount Loaned</th>
                    <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Total Interest</th>
                    <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Total Due</th>
                    <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Total Paid</th>
                    <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Balance</th>
                  </tr>
                </thead>
                <tbody className="text-black dark:text-white">
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-sm px-[10px] py-[16px] text-gray-500">
                        No loans found for the selected filters.
                      </td>
                    </tr>
                  )}
                  {rows.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-[#172036]">
                      <td className="text-sm px-[10px] py-[6px]">{row.disbursement_date ?? "-"}</td>
                      <td className="text-sm px-[10px] py-[6px] font-medium">{row.lender_name ?? "-"}</td>
                      <td className="text-sm px-[10px] py-[6px] text-right">{fmt.format(Number(row.amount_loaned ?? 0))}</td>
                      <td className="text-sm px-[10px] py-[6px] text-right">{fmt.format(Number(row.total_interest ?? 0))}</td>
                      <td className="text-sm px-[10px] py-[6px] text-right">{fmt.format(Number(row.total_due ?? 0))}</td>
                      <td className="text-sm px-[10px] py-[6px] text-right">{fmt.format(Number(row.total_paid ?? 0))}</td>
                      <td className="text-sm px-[10px] py-[6px] text-right font-medium">{fmt.format(Number(row.balance ?? 0))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold border-t-2 border-gray-300 dark:border-[#172036] bg-gray-50 dark:bg-[#15203c]">
                    <td className="px-[10px] py-[8px]" colSpan={2}>TOTAL ({totals.currency || filters.currency_code || "-"})</td>
                    <td className="px-[10px] py-[8px] text-right">{fmt.format(Number(totals.amount_loaned ?? 0))}</td>
                    <td className="px-[10px] py-[8px] text-right">{fmt.format(Number(totals.total_interest ?? 0))}</td>
                    <td className="px-[10px] py-[8px] text-right">{fmt.format(Number(totals.total_due ?? 0))}</td>
                    <td className="px-[10px] py-[8px] text-right">{fmt.format(Number(totals.total_paid ?? 0))}</td>
                    <td className="px-[10px] py-[8px] text-right">{fmt.format(Number(totals.balance ?? 0))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </Can>
    </AuthenticatedLayout>
  )
}

export default LoansReportPage
