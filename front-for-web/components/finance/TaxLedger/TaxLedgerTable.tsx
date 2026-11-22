"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../../store/auth/selectors"
import { useToast } from "../../../hooks/useToast"
import { ToastContainer } from "../../../components/common/Toast"

interface SourceDocument {
  type?: string | null
  id?: number | null
  number?: string | null
  status?: string | null
  tax_amount?: number | null
  total_amount?: number | null
  currency?: string | null
  party_type?: string | null
  party_name?: string | null
  kra_pin?: string | null
  is_deleted?: boolean
}

interface TaxLedgerRow {
  id: number
  transaction_number: string
  side: string
  entry_type: string
  converted_amount: number
  running_balance: number | null
  transaction_currency?: string | null
  transaction_date?: string
  supplier_or_customer_type?: string | null
  supplier_or_customer_name?: string | null
  kra_pin?: string | null
  source_type?: string | null
  source_id?: number | null
  source_document?: SourceDocument | null
  narration?: string | null
  amount_exclusive: number
  vat_in_dr: number | null
  vat_out_cr: number | null
  particulars: string
}

interface ReportTotals {
  amount_exclusive: number
  vat_in_dr: number
  vat_out_cr: number
  vat_liability: number
}

const fmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const day = (iso?: string | null) => {
  if (!iso) return ""
  const value = new Date(iso)
  if (Number.isNaN(value.getTime())) return iso
  const dd = String(value.getDate()).padStart(2, "0")
  const mm = String(value.getMonth() + 1).padStart(2, "0")
  return `${dd}/${mm}/${value.getFullYear()}`
}

// Previous calendar month: first day through last day, ISO strings for the API.
const previousMonthRange = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const end = new Date(now.getFullYear(), now.getMonth(), 0)
  const iso = (value: Date) =>
    `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`
  return { from: iso(start), to: iso(end) }
}

const TaxLedgerTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const defaults = useMemo(() => previousMonthRange(), [])
  const [rows, setRows] = useState<TaxLedgerRow[]>([])
  const [totals, setTotals] = useState<ReportTotals | null>(null)
  const [from, setFrom] = useState(defaults.from)
  const [to, setTo] = useState(defaults.to)
  const [loading, setLoading] = useState(true)

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (from) params.set("from", from)
    if (to) params.set("to", to)
    return params.toString()
  }, [from, to])

  const fetchRows = useCallback(async () => {
    if (!accessToken) {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const resp = await fetch(`/api/tax-transactions?${query}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        addToast(data?.message || "Failed to load tax ledger", "error")
        setRows([])
      } else {
        setRows(Array.isArray(data?.data) ? data.data : [])
        if (data?.totals) {
          setTotals(data.totals)
        }
      }
    } catch {
      addToast("Error loading tax ledger.", "error")
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [accessToken, query])

  useEffect(() => {
    fetchRows()
  }, [fetchRows])

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Filters */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[20px] p-5 rounded-md">
        <div className="flex flex-wrap items-end gap-3">
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
          {(from !== defaults.from || to !== defaults.to) && (
            <button
              type="button"
              onClick={() => {
                setFrom(defaults.from)
                setTo(defaults.to)
              }}
              className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm"
            >
              Reset to last month
            </button>
          )}
        </div>
      </div>

      {/* Report */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">#</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Date</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Bill No.</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Particulars</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Supplier/Customer Name</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">KRA Pin</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Amount Exclusive</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">VAT IN (DR)</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">VAT OUT (CR)</th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {loading && (
                <tr>
                  <td colSpan={9} className="text-center text-sm px-[10px] py-[10px]">Loading...</td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-sm px-[10px] py-[16px] text-gray-500">
                    No tax ledger entries in the selected period.
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((row, index) => {
                  const doc = row.source_document
                  const billNo = doc?.number ?? row.transaction_number
                  const party = row.supplier_or_customer_name ?? doc?.party_name ?? "—"
                  const pin = row.kra_pin ?? doc?.kra_pin ?? "—"
                  return (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]">
                      <td className="text-sm px-[10px] py-[6px] font-medium">{index + 1}</td>
                      <td className="text-sm px-[10px] py-[6px]">{day(row.transaction_date)}</td>
                      <td className="text-sm px-[10px] py-[6px] font-medium">
                        {billNo}
                        {doc?.is_deleted ? " (deleted)" : ""}
                      </td>
                      <td className="text-sm px-[10px] py-[6px]">{row.particulars}</td>
                      <td className="text-sm px-[10px] py-[6px]">{party}</td>
                      <td className="text-sm px-[10px] py-[6px]">{pin}</td>
                      <td className="text-sm px-[10px] py-[6px] text-right">{fmt.format(Number(row.amount_exclusive ?? 0))}</td>
                      <td className="text-sm px-[10px] py-[6px] text-right">
                        {row.vat_in_dr !== null && row.vat_in_dr !== undefined ? fmt.format(Number(row.vat_in_dr)) : ""}
                      </td>
                      <td className="text-sm px-[10px] py-[6px] text-right">
                        {row.vat_out_cr !== null && row.vat_out_cr !== undefined ? fmt.format(Number(row.vat_out_cr)) : ""}
                      </td>
                    </tr>
                  )
                })}
              {!loading && rows.length > 0 && (
                <tr className="border-b-2 border-gray-200 dark:border-[#172036] font-semibold">
                  <td className="text-sm px-[10px] py-[8px]" colSpan={6}>TOTAL</td>
                  <td className="text-sm px-[10px] py-[8px] text-right">
                    {totals ? fmt.format(Number(totals.amount_exclusive)) : ""}
                  </td>
                  <td className="text-sm px-[10px] py-[8px] text-right">
                    {totals ? fmt.format(Number(totals.vat_in_dr)) : ""}
                  </td>
                  <td className="text-sm px-[10px] py-[8px] text-right">
                    {totals ? fmt.format(Number(totals.vat_out_cr)) : ""}
                  </td>
                </tr>
              )}
              {!loading && rows.length > 0 && totals && (
                <tr className="font-semibold">
                  <td className="text-sm px-[10px] py-[8px]" colSpan={7}>VAT Liability (CR − DR)</td>
                  <td className="text-sm px-[10px] py-[8px] text-right" colSpan={2}>
                    {fmt.format(Number(totals.vat_liability))}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default TaxLedgerTable
