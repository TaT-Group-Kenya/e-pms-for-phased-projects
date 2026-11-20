"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../../store/auth/selectors"
import { useToast } from "../../../hooks/useToast"
import { ToastContainer } from "../../common/Toast"
import Can from "../../auth/Can"

interface PeriodMonth {
  id: number
  month: number
  name: string
  status: "open" | "closed"
  closable?: boolean
  start_date: string
  end_date: string
  closed_at: string | null
  closed_by: number | null
  reopened_at: string | null
  reopened_by: number | null
  last_reopen_reason: string | null
}

interface ChecklistGroup {
  label: string
  count: number
  items: { id: number; title: string }[]
}

interface AuditLog {
  id: number
  action: string
  performed_by: number | null
  performed_at: string
  reason: string | null
  snapshot_run_id: number | null
}

const statusChip = (status: string) =>
  status === "closed"
    ? "bg-red-50 text-red-600 border-red-200"
    : "bg-green-50 text-green-600 border-green-200"

const AccountingPeriodsTable: React.FC = () => {
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()

  const [year, setYear] = useState(new Date().getFullYear())
  const [yearInput, setYearInput] = useState(String(new Date().getFullYear()))
  const [months, setMonths] = useState<PeriodMonth[]>([])
  const [loading, setLoading] = useState(true)

  const [closeTarget, setCloseTarget] = useState<PeriodMonth | null>(null)
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [checklist, setChecklist] = useState<ChecklistGroup[]>([])
  const [loadingChecklist, setLoadingChecklist] = useState(false)
  const [formRate, setFormRate] = useState("128.45")
  const [closing, setClosing] = useState(false)

  const [reopenTarget, setReopenTarget] = useState<PeriodMonth | null>(null)
  const [showReopenModal, setShowReopenModal] = useState(false)
  const [reopenReason, setReopenReason] = useState("")
  const [reopening, setReopening] = useState(false)

  const [logsTarget, setLogsTarget] = useState<PeriodMonth | null>(null)
  const [showLogsModal, setShowLogsModal] = useState(false)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)

  const fetchMonths = useCallback(
    async (targetYear: number) => {
      if (!accessToken) {
        setMonths([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const resp = await fetch(`/api/accounting-periods?fiscal_year=${targetYear}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data: any = await resp.json().catch(() => null)
        if (!resp.ok) {
          addToast(data?.message || "Failed to load accounting periods.", "error")
          setMonths([])
          return
        }
        setMonths(Array.isArray(data?.months) ? data.months : [])
      } catch {
        addToast("Error loading accounting periods.", "error")
        setMonths([])
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken],
  )

  useEffect(() => {
    fetchMonths(year)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year])

  const openChecklist = async (period: PeriodMonth) => {
    setCloseTarget(period)
    setShowCloseModal(true)
    setChecklist([])
    setLoadingChecklist(true)
    try {
      const resp = await fetch(`/api/accounting-periods/${period.id}/checklist`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data: any = await resp.json().catch(() => null)
      if (resp.ok) {
        setChecklist(Array.isArray(data?.stranded_drafts) ? data.stranded_drafts : [])
        const rate = data?.suggested_forex_rate
        if (rate && Number(rate) > 0) {
          setFormRate(String(rate))
        }
      }
    } catch {
      // non-blocking preview
    } finally {
      setLoadingChecklist(false)
    }
  }

  const handleConfirmClose = async () => {
    if (!closeTarget || !accessToken) return

    const rate = Number(formRate)
    if (!rate || rate <= 0) {
      addToast("Please enter a valid forex rate greater than zero.", "error")
      return
    }

    setClosing(true)
    try {
      const resp = await fetch(`/api/accounting-periods/${closeTarget.id}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ forex_rate: rate }),
      })
      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        addToast(data?.message || "Failed to close the period.", "error")
        return
      }
      addToast(`${closeTarget.name} closed. Trial balance snapshot recorded.`, "success")
      setShowCloseModal(false)
      setCloseTarget(null)
      await fetchMonths(year)
    } catch {
      addToast("Failed to close the period.", "error")
    } finally {
      setClosing(false)
    }
  }

  const handleConfirmReopen = async () => {
    if (!reopenTarget || !accessToken) return

    if (reopenReason.trim().length < 3) {
      addToast("A reason (at least 3 characters) is required to reopen a period.", "error")
      return
    }

    setReopening(true)
    try {
      const resp = await fetch(`/api/accounting-periods/${reopenTarget.id}/reopen`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ reason: reopenReason.trim() }),
      })
      const data: any = await resp.json().catch(() => null)
      if (!resp.ok) {
        addToast(data?.message || "Failed to reopen the period.", "error")
        return
      }
      addToast(`${reopenTarget.name} reopened. The reason was recorded in the audit trail.`, "success")
      setShowReopenModal(false)
      setReopenTarget(null)
      setReopenReason("")
      await fetchMonths(year)
    } catch {
      addToast("Failed to reopen the period.", "error")
    } finally {
      setReopening(false)
    }
  }

  const openLogs = async (period: PeriodMonth) => {
    setLogsTarget(period)
    setShowLogsModal(true)
    setLogs([])
    setLoadingLogs(true)
    try {
      const resp = await fetch(`/api/accounting-periods/${period.id}/logs`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data: any = await resp.json().catch(() => null)
      if (resp.ok) setLogs(Array.isArray(data?.data) ? data.data : [])
    } catch {
      // modal shows empty state on failure
    } finally {
      setLoadingLogs(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[20px] md:mb-[25px] p-5 rounded-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[15px]">
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white">Accounting Periods</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Close past months to prevent further financial changes. Current and future months stay open until they fully end. Closing records a trial balance snapshot as at the last day of the month.
            </p>
          </div>
          <div className="flex items-end gap-2">
            <div>
              <label className="block text-xs font-medium mb-[5px]">Fiscal year</label>
              <input
                type="number"
                min="2000"
                max="2999"
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                className="w-[110px] px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const y = parseInt(yearInput, 10)
                if (y >= 2000 && y <= 2999) setYear(y)
              }}
              className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium"
            >
              Load
            </button>
          </div>
        </div>
      </div>

      {/* 12-month grid */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-5">
        {loading ? (
          <div className="text-center text-sm py-4 text-gray-500">Loading…</div>
        ) : months.length === 0 ? (
          <div className="text-center text-sm py-4 text-gray-500">
            No period data for {year}. Periods are created automatically when financial documents are dated in this year.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px]">
            {months.map((m) => (
              <div key={m.id} className="border border-gray-100 dark:border-[#172036] rounded-md p-[15px]">
                <div className="flex items-center justify-between mb-[10px]">
                  <div>
                    <div className="text-sm font-semibold text-black dark:text-white">{m.name}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      {m.start_date} → {m.end_date}
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-[8px] py-[3px] rounded-full border ${statusChip(m.status)}`}>
                    {m.status === "closed" ? "Closed" : "Open"}
                  </span>
                </div>

                {m.status === "closed" && m.last_reopen_reason && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 italic mb-[8px]">
                    Last reopened: {m.last_reopen_reason}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {m.status === "open" && (m.closable ?? false) && (
                    <Can any={["ROLE_CLOSE_ACCOUNTING_PERIOD"]}>
                      <button
                        type="button"
                        onClick={() => openChecklist(m)}
                        className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Close month…
                      </button>
                    </Can>
                  )}
                  {m.status === "open" && !(m.closable ?? false) && (
                    <span
                      className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-gray-100 dark:border-[#172036] text-xs text-gray-400"
                      title="The month must have fully ended before it can be closed."
                    >
                      Not yet closeable
                    </span>
                  )}
                  {m.status === "closed" && (
                    <Can any={["ROLE_REOPEN_ACCOUNTING_PERIOD"]}>
                      <button
                        type="button"
                        onClick={() => {
                          setReopenTarget(m)
                          setShowReopenModal(true)
                        }}
                        className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium"
                      >
                        Reopen…
                      </button>
                    </Can>
                  )}
                  <Can any={["ROLE_VIEW_ACCOUNTING_PERIOD"]}>
                    <button
                      type="button"
                      onClick={() => openLogs(m)}
                      className="inline-flex items-center px-[10px] py-[5px] rounded-md border border-gray-200 dark:border-[#172036] text-xs font-medium"
                    >
                      Audit trail
                    </button>
                  </Can>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Close modal with review checklist */}
      {showCloseModal && closeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-lg p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[6px]">
              Close {closeTarget.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-[12px]">
              After closing, no financial documents can be created, edited or deleted with a date inside this month. A trial balance snapshot will be recorded as at {closeTarget.end_date}.
            </p>

            <div className="border border-gray-100 dark:border-[#172036] rounded-md p-[12px] mb-[12px] max-h-52 overflow-y-auto">
              <div className="text-xs font-medium mb-[8px]">Review: documents that will become un-editable (drafts)</div>
              {loadingChecklist ? (
                <div className="text-xs text-gray-500">Checking…</div>
              ) : checklist.length === 0 ? (
                <div className="text-xs text-green-600 py-2">No stranded drafts. Nothing is left incomplete in this month.</div>
              ) : (
                <div className="space-y-[10px]">
                  {checklist.map((group, gi) => (
                    <div key={gi}>
                      <div className="text-xs font-medium">
                        {group.label} <span className="text-gray-500">({group.count})</span>
                      </div>
                      <ul className="list-disc ltr:pl-5 rtl:pr-5 text-[11px] text-gray-500 dark:text-gray-400">
                        {group.items.slice(0, 8).map((item, ii) => (
                          <li key={ii}>{item.title}</li>
                        ))}
                        {group.items.length > 8 && <li>… and {group.items.length - 8} more</li>}
                      </ul>
                    </div>
                  ))}
                  <p className="text-[11px] text-amber-600 pt-1">
                    These can still be finalised after reopening the period if necessary.
                  </p>
                </div>
              )}
            </div>

            <div className="mb-[16px]">
              <label className="block text-xs font-medium mb-[5px]">Forex rate for the snapshot (USD → KES)</label>
              <input
                type="number"
                min="0.000001"
                step="0.0001"
                value={formRate}
                onChange={(e) => setFormRate(e.target.value)}
                className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCloseModal(false)}
                disabled={closing}
                className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                disabled={closing}
                className="px-[13px] py-[8px] rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-60"
              >
                {closing ? "Closing…" : "Close month"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reopen modal (admin only; mandatory reason) */}
      {showReopenModal && reopenTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-md p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[6px]">
              Reopen {reopenTarget.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-[12px]">
              Reopening allows corrections for {reopenTarget.name}. The snapshot already recorded is preserved, and your reason is stored in the audit trail.
            </p>
            <div className="mb-[16px]">
              <label className="block text-xs font-medium mb-[5px]">Reason (required)</label>
              <textarea
                rows={3}
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                className="w-full px-[10px] py-[8px] border border-gray-200 dark:border-[#172036] rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReopenModal(false)}
                disabled={reopening}
                className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReopen}
                disabled={reopening}
                className="px-[13px] py-[8px] rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-60"
              >
                {reopening ? "Reopening…" : "Reopen month"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit trail modal */}
      {showLogsModal && logsTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b1220] rounded-md shadow-lg w-full max-w-lg p-[20px] md:p-[25px]">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-[10px]">
              Audit trail — {logsTarget.name}
            </h3>
            {loadingLogs ? (
              <div className="text-sm text-gray-500 py-4">Loading…</div>
            ) : logs.length === 0 ? (
              <div className="text-sm text-gray-500 py-4">
                No close/reopen events recorded yet for this period.
              </div>
            ) : (
              <ul className="space-y-[10px] max-h-80 overflow-y-auto mb-[14px]">
                {logs.map((log) => (
                  <li key={log.id} className="border border-gray-100 dark:border-[#172036] rounded-md p-[10px]">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${log.action === "closed" ? "text-red-600" : "text-blue-500"}`}>
                        {log.action === "closed" ? "Closed" : "Reopened"}
                      </span>
                      <span className="text-[11px] text-gray-500">{new Date(log.performed_at).toLocaleString()}</span>
                    </div>
                    {log.reason && <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Reason: {log.reason}</div>}
                    {log.snapshot_run_id && (
                      <div className="text-[11px] text-gray-500 mt-1">
                        Snapshot run #{log.snapshot_run_id} —{" "}
                        <a className="text-blue-500 underline" href={`/finance/trial-balance/${log.snapshot_run_id}`}>
                          view trial balance
                        </a>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowLogsModal(false)}
                className="px-[12px] py-[8px] rounded-md border border-gray-200 dark:border-[#172036] text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AccountingPeriodsTable
