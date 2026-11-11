import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../store/auth/selectors";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/common/Toast";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import { formatApiError } from "../../../utils/errorHandler";

interface RunMeta {
  id: number
  run_number: string
  as_at_date: string
  forex_rate: number
  base_currency: string
  created_at: string
}

interface ChartLine {
  id: number
  chart_name: string
  account_name: string
  category: string
  debit_kes: number
  credit_kes: number
}

const fmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const TrialBalanceDetail: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const [detail, setDetail] = useState<{
    run: RunMeta
    lines: ChartLine[]
    totals: { debit_kes: number; credit_kes: number; balanced: boolean }
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || !accessToken) return

    const controller = new AbortController()
    const fetchDetail = async () => {
      setLoading(true)
      try {
        const resp = await fetch(`/api/trial-balance/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        })
        const data: any = await resp.json().catch(() => null)
        if (!resp.ok || !data?.data?.run) {
          addToast(data?.message || "Failed to load trial balance", "error")
          return
        }
        setDetail(data.data)
      } catch (err: any) {
        if (err?.name === "AbortError") return
        addToast("Error loading trial balance detail.", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken])

  const grouped = (() => {
    const seen = new Set<string>()
    const groups: { category: string; rows: ChartLine[] }[] = []
    for (const l of detail?.lines ?? []) {
      if (seen.has(l.category)) {
        groups[groups.length - 1].rows.push(l)
        continue
      }
      seen.add(l.category)
      groups.push({ category: l.category, rows: [l] })
    }
    return groups
  })()

  const [exporting, setExporting] = useState(false)

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExport = async (type: 'pdf' | 'csv') => {
    if (!detail || !accessToken) return

    // CSV is built client-side from the loaded snapshot (orders-summary pattern).
    if (type === 'csv') {
      exportCsv()
      return
    }

    // PDF renders on the backend and is downloaded here.
    try {
      setExporting(true)
      const url = `/api/trial-balance/${detail.run.id}/export-csv`.replace('export-csv', 'export.pdf')
      const resp = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!resp.ok) {
        const error = await resp.json().catch(() => null)
        addToast(error?.message || 'Failed to export PDF', 'error')
        return
      }
      const blob = await resp.blob()
      downloadBlob(blob, `${detail.run.run_number}-trial-balance.pdf`)
      addToast('PDF exported.', 'success')
    } catch {
      addToast('Network error exporting PDF', 'error')
    } finally {
      setExporting(false)
    }
  }

  function exportCsv() {
    if (!detail) return

    const columns = ['Type', 'Account', 'Debit (KES)', 'Credit (KES)']
    const rows = detail.lines.map((l) => [
      l.category,
      l.account_name,
      l.debit_kes,
      l.credit_kes,
    ])
    const totals = [
      'TOTAL',
      '',
      detail.totals.debit_kes,
      detail.totals.credit_kes,
    ]

    const csv = [
      columns.join(','),
      ...rows.map((r) => r.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(',')),
      totals.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(','),
    ].join('\n')

    downloadBlob(
      new Blob([csv], { type: 'text/csv' }),
      `${detail.run.run_number}-trial-balance.csv`,
    )
    addToast('CSV exported.', 'success')
  }

  return (
    <AuthenticatedLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="mb-[25px] md:flex items-center justify-between">
        <div>
          <h5 className="!mb-1">
            Trial Balance {detail ? `— ${detail.run.run_number}` : ""}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {detail
              ? `As at ${detail.run.as_at_date} · Forex USD→KES ${detail.run.forex_rate} · Generated ${new Date(detail.run.created_at).toLocaleString()}`
              : "Immutable snapshot of the books as at a date."}
          </p>
        </div>

        <ol className="breadcrumb items-center inline-flex flex-wrap mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 py-[4px]">
            <Link
              href="/dashboard/ecommerce/"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] py-[4px]">
            <Link href="/finance/trial-balance/" className="transition-all hover:text-primary-500">
              Trial Balance
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] py-[4px] text-black dark:text-white">
            {detail ? detail.run.run_number : "Detail"}
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[15px] mb-4">
          <div className="text-sm text-gray-500">
            All amounts in KES. USD bank balances were translated at the run's
            forex rate; historical ledger rows keep their recorded rates.
          </div>
          <div className="flex items-center gap-2">
            {detail && (
              <>
                <button
                  type="button"
                  onClick={() => handleExport("pdf")}
                  disabled={exporting}
                  className="px-[12px] py-[6px] rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-60"
                >
                  Export PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("csv")}
                  disabled={exporting}
                  className="px-[12px] py-[6px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium disabled:opacity-60"
                >
                  Export CSV
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => router.push("/finance/trial-balance/")}
              className="px-[12px] py-[6px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium"
            >
              ← Back to runs
            </button>
          </div>
        </div>

        <div className="table-responsive overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Type</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Account</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Debit (KES)</th>
                <th className="font-medium ltr:text-right rtl:text-left px-[10px] py-[8px] bg-gray-50 dark:bg-[#15203c]">Credit (KES)</th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center text-sm px-[10px] py-[10px]">Loading...</td>
                </tr>
              )}
              {!loading &&
                grouped.map((group) => (
                  <React.Fragment key={group.category}>
                    {group.rows.map((l, idx) => (
                      <tr key={l.id} className="border-b border-gray-100 dark:border-[#172036]">
                        {idx === 0 ? (
                          <td className="px-[10px] py-[6px] font-medium">{group.category}</td>
                        ) : (
                          <td className="px-[10px] py-[6px]" />
                        )}
                        <td className="px-[10px] py-[6px]">{l.account_name}</td>
                        <td className="px-[10px] py-[6px] text-right">{fmt.format(l.debit_kes)}</td>
                        <td className="px-[10px] py-[6px] text-right">{fmt.format(l.credit_kes)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
            </tbody>
            <tfoot>
              <tr className="font-bold border-t-2 border-gray-300 dark:border-[#172036]">
                <td className="px-[10px] py-[8px]" colSpan={2}>TOTAL</td>
                <td className="px-[10px] py-[8px] text-right">
                  {fmt.format(detail?.totals.debit_kes ?? 0)}
                </td>
                <td className="px-[10px] py-[8px] text-right">
                  {fmt.format(detail?.totals.credit_kes ?? 0)}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className={`px-[10px] py-[6px] text-xs ${detail?.totals.balanced ? "text-green-600" : "text-red-600"}`}>
                  {detail
                    ? detail.totals.balanced
                      ? "Balanced: total debits equal total credits."
                      : `OUT OF BALANCE by ${fmt.format(detail.totals.debit_kes - detail.totals.credit_kes)} KES`
                    : ""}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default TrialBalanceDetail
