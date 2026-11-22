"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../../store/auth/selectors"
import { useToast } from "../../../hooks/useToast"
import { ToastContainer } from "../../../components/common/Toast"

interface TaxBillRow {
  id: number
  bill_number: string
  date: string | null
  period: string
  particulars: string
  name: string
  amount: number
  paid: number
  balance: number
  status: string
  run_date: string | null
  paid_date: string | null
  vat_out: number
  vat_in: number
  vat_liability: number
  settled_for_period?: number
  carried_forward?: number
  transaction?: { transaction_number: string; transaction_date: string; amount: number } | null
  tax_ledger_entry?: { transaction_number: string; running_balance: number | null } | null
}

interface AccountRow {
  id: number
  name: string
  currency: string
  balance: string | number
}

interface BillDetail {
  bill: TaxBillRow
}



const fmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const day = (iso?: string | null) => {
  if (!iso) return ""
  const value = new Date(iso)
  if (Number.isNaN(value.getTime())) return iso
  const d = String(value.getDate()).padStart(2, "0")
  const m = String(value.getMonth() + 1).padStart(2, "0")
  return `${d}/${m}/${value.getFullYear()}`
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

// Months that could still be run: previous month backwards two years.
const runMonthOptions = useMemoFactory()

function useMemoFactory() {
  const options: { year: number; month: number; label: string }[] = []
  const now = new Date()
  for (let offset = 1; offset <= 24; offset++) {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    options.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
    })
  }
  return options
}

const TaxBillsTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const [rows, setRows] = useState<TaxBillRow[]>([])
  const [currentBalance, setCurrentBalance] = useState(0)
  const [accounts, setAccounts] = useState<AccountRow[]>([])
  const [loading, setLoading] = useState(true)

  // Run modal
  const [runOpen, setRunOpen] = useState(false)
  const [runYear, setRunYear] = useState<number>(new Date().getFullYear())
  const [runMonth, setRunMonth] = useState<number>(new Date().getMonth())
  const [running, setRunning] = useState(false)

  // Pay modal
  const [payBill, setPayBill] = useState<TaxBillRow | null>(null)
  const [payAccountId, setPayAccountId] = useState<number | "">("")
  const [payDate, setPayDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [payReference, setPayReference] = useState("")
  const [paying, setPaying] = useState(false)

  // Detail modal
  const [detail, setDetail] = useState<BillDetail | null>(null)

  const fetchBills = useCallback(async () => {
    if (!accessToken) {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const resp = await fetch(`/api/tax-bills`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        addToast(data?.message || "Failed to load tax bills", "error")
        setRows([])
      } else {
        setRows(Array.isArray(data?.data) ? data.data : [])
        setCurrentBalance(Number(data?.position?.current_balance ?? 0))
      }
    } catch {
      addToast("Error loading tax bills.", "error")
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    fetchBills()
  }, [fetchBills])

  const fetchAccounts = useCallback(async () => {
    if (!accessToken) return
    try {
      // Tax bills are settled in KES: only KES accounts qualify.
      const resp = await fetch(`/api/accounts/list?page=1&per_page=100&currency=KES`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data: any = await resp.json().catch(() => null)
      if (resp.ok) {
        const rows = Array.isArray(data?.data) ? data.data : []
        setAccounts(rows.filter((a: AccountRow) => (a.currency ?? "KES") === "KES"))
      }
    } catch {
      // Non-critical: the pay modal simply shows an empty picker.
    }
  }, [accessToken])

  const openRun = () => {
    const previous = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
    setRunYear(previous.getFullYear())
    setRunMonth(previous.getMonth() + 1)
    setRunOpen(true)
  }

  const submitRun = async () => {
    if (!accessToken) return
    setRunning(true)
    try {
      const resp = await fetch(`/api/tax-bills/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ period_year: runYear, period_month: runMonth }),
      })
      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        addToast(data?.message || "Failed to run the tax bill.", "error")
      } else {
        addToast(data?.message || "Tax bill generated.", "success")
        setRunOpen(false)
        await fetchBills()
      }
    } catch {
      addToast("Error running the tax bill.", "error")
    } finally {
      setRunning(false)
    }
  }

  const openPay = (bill: TaxBillRow) => {
    setPayBill(bill)
    setPayAccountId("")
    setPayDate(new Date().toISOString().slice(0, 10))
    setPayReference("")
    fetchAccounts()
  }

  const submitPay = async () => {
    if (!accessToken || !payBill) return
    if (!payAccountId) {
      addToast("Select an account to pay from.", "error")
      return
    }
    setPaying(true)
    try {
      const resp = await fetch(`/api/tax-bills/${payBill.id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          account_id: payAccountId,
          payment_date: payDate,
          reference: payReference || undefined,
        }),
      })
      const data: any = await resp.json().catch(() => null)

      if (!resp.ok) {
        addToast(data?.message || "Payment failed.", "error")
      } else {
        addToast(data?.message || "Tax bill paid.", "success")
        setPayBill(null)
        await fetchBills()
      }
    } catch {
      addToast("Error paying the tax bill.", "error")
    } finally {
      setPaying(false)
    }
  }

  const openDetail = async (bill: TaxBillRow) => {
    if (!accessToken) return
    setDetail({ bill })
    try {
      const resp = await fetch(`/api/tax-bills/${bill.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        addToast(data?.message || "Failed to load bill details.", "error")
        setDetail(null)
      } else {
        setDetail({ bill: data.data })
      }
    } catch {
      addToast("Error loading bill details.", "error")
      setDetail(null)
    }
  }

  const downloadPdf = async (bill: TaxBillRow) => {
    if (!accessToken) return
    try {
      const resp = await fetch(`/api/tax-bills/${bill.id}/export-pdf`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!resp.ok) {
        const data: any = await resp.json().catch(() => null)
        addToast(data?.message || "Failed to export the tax bill PDF.", "error")
        return
      }
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${bill.bill_number}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch {
      addToast("Error exporting the tax bill PDF.", "error")
    }
  }

  const statusChip = (bill: TaxBillRow) =>
    bill.status === "paid"
      ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300"
      : "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300"

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Position + actions */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[20px] p-5 rounded-md md:flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Current tax liability (ledger)</div>
          <div className="text-lg font-semibold text-black dark:text-white">
            KES {fmt.format(currentBalance)}
          </div>
          <p className="mt-[6px] text-[11px] text-gray-500 dark:text-gray-400">
            Run the previous month&apos;s VAT bill once per month, then settle it in a single installment.
          </p>
        </div>
        <button
          type="button"
          onClick={openRun}
          className="px-[15px] py-[9px] rounded-md bg-primary-500 text-white text-sm font-medium"
        >
          Run monthly bill
        </button>
      </div>

      {/* Bills table */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">#</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Date</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Bill No.</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Particulars</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Name</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Amount</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Paid</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Balance</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Actions</th>
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
                    No tax bills yet — run the previous month to generate the first bill.
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((bill, index) => (
                  <tr key={bill.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c]">
                    <td className="text-sm px-[10px] py-[6px] font-medium">{index + 1}</td>
                    <td className="text-sm px-[10px] py-[6px]">{day(bill.date)}</td>
                    <td className="text-sm px-[10px] py-[6px] font-medium">{bill.bill_number}</td>
                    <td className="text-sm px-[10px] py-[6px]">{bill.particulars}</td>
                    <td className="text-sm px-[10px] py-[6px]">{bill.name}</td>
                    <td className="text-sm px-[10px] py-[6px] text-right font-medium">{fmt.format(Number(bill.amount ?? 0))}</td>
                    <td className="text-sm px-[10px] py-[6px] text-right">{fmt.format(Number(bill.paid ?? 0))}</td>
                    <td className="text-sm px-[10px] py-[6px] text-right">{fmt.format(Number(bill.balance ?? 0))}</td>
                    <td className="text-sm px-[10px] py-[6px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => openDetail(bill)}
                          className="px-[8px] py-[3px] rounded-md border border-gray-200 dark:border-[#172036] text-xs"
                        >
                          Details
                        </button>
                        {bill.status !== "paid" && (
                          <button
                            type="button"
                            onClick={() => openPay(bill)}
                            className="px-[8px] py-[3px] rounded-md bg-primary-500 text-white text-xs"
                          >
                            Pay
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => downloadPdf(bill)}
                          className="px-[8px] py-[3px] rounded-md border border-gray-200 dark:border-[#172036] text-xs"
                        >
                          PDF
                        </button>
                        <span className={`inline-flex items-center px-2 py-[3px] rounded-full text-[11px] font-medium ${statusChip(bill)}`}>
                          {bill.status === "paid" ? "Paid" : "Pending payment"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run modal */}
      {runOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !running && setRunOpen(false)}>
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h5 className="!mb-2">Run monthly tax bill</h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              The bill snapshots the selected month&apos;s VAT positions from the ledger. Each month can only be billed once.
            </p>
            <label className="block text-xs font-medium mb-[5px]">Period</label>
            <select
              value={`${runYear}-${runMonth}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split("-").map(Number)
                setRunYear(year)
                setRunMonth(month)
              }}
              className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
            >
              {runMonthOptions.map((option) => (
                <option key={`${option.year}-${option.month}`} value={`${option.year}-${option.month}`}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setRunOpen(false)} className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm" disabled={running}>
                Cancel
              </button>
              <button
                type="button"
                onClick={submitRun}
                disabled={running}
                className="px-[15px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium disabled:opacity-50"
              >
                {running ? "Running..." : "Run bill"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay modal */}
      {payBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !paying && setPayBill(null)}>
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h5 className="!mb-2">Pay {payBill.bill_number}</h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {payBill.particulars} — balance KES {fmt.format(Number(payBill.balance))}. Paid in one installment; the payment
              reduces the tax liability in the ledger.
            </p>

            <label className="block text-xs font-medium mb-[5px]">Pay from account</label>
            <select
              value={payAccountId}
              onChange={(e) => setPayAccountId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
            >
              <option value="">Select account…</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.currency} {fmt.format(Number(account.balance ?? 0))})
                </option>
              ))}
            </select>

            <label className="block text-xs font-medium mb-[5px] mt-3">Payment date</label>
            <input
              type="date"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
            />

            <label className="block text-xs font-medium mb-[5px] mt-3">Reference (optional)</label>
            <input
              type="text"
              value={payReference}
              onChange={(e) => setPayReference(e.target.value)}
              className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
            />

            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setPayBill(null)} className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm" disabled={paying}>
                Cancel
              </button>
              <button
                type="button"
                onClick={submitPay}
                disabled={paying || !payAccountId}
                className="px-[15px] py-[8px] rounded-md bg-primary-500 text-white text-sm font-medium disabled:opacity-50"
              >
                {paying ? "Paying..." : `Pay KES ${fmt.format(Number(payBill.balance))}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white dark:bg-[#0c1427] rounded-md p-5 w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h5 className="!mb-1">{detail.bill.bill_number} — {detail.bill.particulars}</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {detail.bill.name} · Period {detail.bill.period}
                </p>
              </div>
              <button type="button" onClick={() => setDetail(null)} className="text-gray-500 text-sm">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="px-3 py-2 rounded-md bg-gray-50 dark:bg-[#081328]">
                <div className="text-xs text-gray-500 dark:text-gray-400">VAT OUT (CR)</div>
                <div className="text-sm font-semibold">{fmt.format(Number(detail.bill.vat_out))}</div>
              </div>
              <div className="px-3 py-2 rounded-md bg-gray-50 dark:bg-[#081328]">
                <div className="text-xs text-gray-500 dark:text-gray-400">VAT IN (DR)</div>
                <div className="text-sm font-semibold">{fmt.format(Number(detail.bill.vat_in))}</div>
              </div>
              <div className="px-3 py-2 rounded-md bg-gray-50 dark:bg-[#081328]">
                <div className="text-xs text-gray-500 dark:text-gray-400">Liability</div>
                <div className="text-sm font-semibold">{fmt.format(Number(detail.bill.vat_liability))}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="px-3 py-2 rounded-md bg-gray-50 dark:bg-[#081328] text-sm">
                <span className="text-gray-500 dark:text-gray-400">Run date: </span>
                <span className="font-medium">{day(detail.bill.run_date)}</span>
              </div>
              <div className="px-3 py-2 rounded-md bg-gray-50 dark:bg-[#081328] text-sm">
                <span className="text-gray-500 dark:text-gray-400">Status: </span>
                <span className="font-medium capitalize">{detail.bill.status.replace(/_/g, " ")}</span>
              </div>
              {detail.bill.paid_date && (
                <div className="px-3 py-2 rounded-md bg-gray-50 dark:bg-[#081328] text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Paid date: </span>
                  <span className="font-medium">{day(detail.bill.paid_date)}</span>
                </div>
              )}
              {detail.bill.transaction && (
                <div className="px-3 py-2 rounded-md bg-gray-50 dark:bg-[#081328] text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Settled by: </span>
                  <span className="font-medium">{detail.bill.transaction.transaction_number}</span>
                </div>
              )}
            </div>

            {/* Settlement attribution */}
            <div className="border border-gray-100 dark:border-[#172036] rounded-md p-3 mb-4 text-sm">
              <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-2">
                Liability settlement (per period)
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Declared</div>
                  <div className="font-semibold">{fmt.format(Number(detail.bill.vat_liability))}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Settled for this period</div>
                  <div className="font-semibold">{fmt.format(Number(detail.bill.settled_for_period ?? 0))}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Carried forward</div>
                  <div className="font-semibold">{fmt.format(Number(detail.bill.carried_forward ?? 0))}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Outstanding</div>
                  <div className="font-semibold">{fmt.format(Number(detail.bill.balance))}</div>
                </div>
              </div>
              {detail.bill.tax_ledger_entry?.running_balance != null && (
                <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                  Ledger liability after the payment entry: KES {fmt.format(Number(detail.bill.tax_ledger_entry.running_balance))}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TaxBillsTable
