"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../store/auth/selectors"
import { useToast } from "../../hooks/useToast"
import { ToastContainer } from "../common/Toast"
import { SHIP_CONTAINER_TYPE_LABELS, type ShipContainerType } from "../../constants/shipContainers"

export type TransitNotificationRow = {
  id: number
  reference_number?: string | null
  container_type: ShipContainerType
  container_identifier?: string | null
  container_numbers?: string[] | null
  client?: string | null
  customer?: string | null
  bol_no?: string | null
  port_in?: string | null
  get_in?: string | null
  get_out?: string | null
  eta?: string | null
  transit_start?: string | null
  exit_deadline?: string | null
  day_number?: number | null
  exit_days?: number
  days_remaining?: number | null
  overdue?: boolean
}

const TransitNotificationsPanel: React.FC = () => {
  const accessToken = useSelector(selectAccessToken)
  const { toasts, addToast, removeToast } = useToast()
  const [rows, setRows] = useState<TransitNotificationRow[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!accessToken) return
      setLoading(true)
      try {
        const resp = await fetch("/api/ship-containers/id/transit-notifications", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const json = await resp.json().catch(() => null)
        if (!resp.ok) throw new Error(json?.message || "Failed to load transit deadlines")
        setRows(json?.data ?? [])
        setCount(json?.count ?? 0)
      } catch (err: any) {
        addToast(err?.message || "Failed to load transit deadlines", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [accessToken, addToast])

  if (loading) return null

  if (count === 0) {
    return (
      <div className="bg-success-50 text-success-500 rounded-md p-[15px] mb-[20px] text-[13px] flex items-center gap-2">
        <i className="material-symbols-outlined !text-[20px]">check_circle</i>
        No transit cargo approaching the exit deadline.
      </div>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px] mb-[20px] border-l-4 border-warning-500">
        <div className="flex items-center justify-between mb-[12px]">
          <h6 className="!mb-0 text-black dark:text-white flex items-center gap-2">
            <i className="material-symbols-outlined !text-[20px] text-warning-500">notification_important</i>
            Transit exit deadlines ({count})
          </h6>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="text-[13px] text-gray-500 hover:text-primary-500"
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>

        {open && (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400">
                  <th className="py-[8px] pr-[12px] font-medium">Ref</th>
                  <th className="py-[8px] pr-[12px] font-medium">Type</th>
                  <th className="py-[8px] pr-[12px] font-medium">Client Name</th>
                  <th className="py-[8px] pr-[12px] font-medium">BOL No</th>
                  <th className="py-[8px] pr-[12px] font-medium">Container Nos</th>
                  <th className="py-[8px] pr-[12px] font-medium">Port In</th>
                  <th className="py-[8px] pr-[12px] font-medium">Get In (Arrival)</th>
                  <th className="py-[8px] pr-[12px] font-medium">Deadline</th>
                  <th className="py-[8px] pr-[12px] font-medium">Days Left</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#15203c]">
                {rows.map((row) => (
                  <tr key={row.id} className="text-black dark:text-white">
                    <td className="py-[8px] pr-[12px] whitespace-nowrap">
                      <Link href={`/ship-containers/${row.id}`} className="text-primary-500 hover:text-primary-600">
                        {row.reference_number || `#${row.id}`}
                      </Link>
                    </td>
                    <td className="py-[8px] pr-[12px] whitespace-nowrap">{SHIP_CONTAINER_TYPE_LABELS[row.container_type]}</td>
                    <td className="py-[8px] pr-[12px] whitespace-nowrap">{row.client || "—"}</td>
                    <td className="py-[8px] pr-[12px] whitespace-nowrap">{row.bol_no || "—"}</td>
                    <td
                      className="py-[8px] pr-[12px] whitespace-nowrap max-w-[260px] truncate"
                      title={(row.container_numbers ?? []).join(", ")}
                    >
                      {row.container_numbers?.length ? row.container_numbers.join(", ") : "—"}
                    </td>
                    <td className="py-[8px] pr-[12px] whitespace-nowrap">{row.port_in || "—"}</td>
                    <td className="py-[8px] pr-[12px] whitespace-nowrap">{row.get_in ?? row.eta ?? "—"}</td>
                    <td className="py-[8px] pr-[12px] whitespace-nowrap">{row.exit_deadline || "—"}</td>
                    <td className="py-[8px] pr-[12px] whitespace-nowrap">
                      {row.overdue ? (
                        <span className="bg-danger-50 text-danger-500 px-2 py-0.5 rounded-md">Overdue</span>
                      ) : (
                        <span className={(row.days_remaining ?? 0) <= 2 ? "text-danger-500 font-semibold" : ""}>
                          {row.days_remaining ?? 0}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export default TransitNotificationsPanel