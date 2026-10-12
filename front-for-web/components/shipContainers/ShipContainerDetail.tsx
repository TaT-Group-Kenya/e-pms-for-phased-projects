"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../store/auth/selectors"
import { useToast } from "../../hooks/useToast"
import { ToastContainer } from "../common/Toast"
import Can from "../auth/Can"
import {
  SHIP_CONTAINER_STATUS_LABELS,
  SHIP_CONTAINER_TYPE_CONFIGS,
  SHIP_CONTAINER_TYPE_LABELS,
  STATUS_BADGE_STYLES,
  transitLabel,
  type ShipContainerType,
} from "../../constants/shipContainers"

export type ContainerDetail = {
  id: number
  reference_number?: string | null
  container_type: ShipContainerType
  client_name?: string | null
  project_owner_id?: number | null
  customer_id?: number | null
  customer?: { name?: string } | null
  container_numbers?: string[] | null
  status: string
  eta?: string | null
  etd?: string | null
  port_in?: string | null
  port_out?: string | null
  get_in?: string | null
  get_out?: string | null
  exit_date?: string | null
  exit_border?: string | null
  exit_remarks?: string | null
  transit?: {
    exit_days: number
    notify_day: number
    start_date?: string | null
    deadline?: string | null
    day_number?: number | null
    days_remaining?: number | null
    needs_notification?: boolean
    overdue?: boolean
  } | null
  type_fields: Array<{
    attribute: string
    label: string
    value: any
    required: boolean
    type: string
    options: string[] | null
  }>
  created_at?: string | null
  updated_at?: string | null
  created_by_user?: { first_name?: string; last_name?: string } | null
}

const inputClass =
  "bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[45px] text-black dark:text-white text-[15px] rounded-md w-full block px-[17px] outline-0"

const statusBadge = (status: string): string =>
  STATUS_BADGE_STYLES[status] || "bg-gray-50 text-gray-500"

const displayValue = (value: any, kind: string): string => {
  if (value == null || value === "") return "—"
  if (kind === "numbers" && Array.isArray(value)) return value.join(", ")
  if (kind === "numeric") return String(value)
  if (kind === "entity") return String(value)
  if (kind === "select" && typeof value === "string") {
    return transitLabel(value)
  }
  if (kind === "datetime" && typeof value === "string") {
    return value.replace("T", " ").slice(0, 16)
  }
  if (kind === "date" && typeof value === "string" && value.includes("T")) {
    return value.slice(0, 10)
  }
  return String(value)
}

const ShipContainerDetail: React.FC<{ container: ContainerDetail }> = ({ container }) => {
  const accessToken = useSelector(selectAccessToken)
  const router = useRouter()
  const { toasts, addToast, removeToast } = useToast()

  const config = SHIP_CONTAINER_TYPE_CONFIGS[container.container_type]
  const isTransit = !!container.transit

  const [getIn, setGetIn] = useState(container.get_in?.slice(0, 10) ?? "")
  const [exitDate, setExitDate] = useState(container.exit_date?.slice(0, 16) ?? "")
  const [exitBorder, setExitBorder] = useState(container.exit_border ?? "")
  const [exitRemarks, setExitRemarks] = useState(container.exit_remarks ?? "")
  const [busy, setBusy] = useState(false)

  /** Copy all container numbers (comma separated) to the clipboard with a toast. */
  const copyNumbers = async (numbers: string[]) => {
    const text = numbers.join(", ")

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // Legacy fallback for non-secure contexts
        const textarea = document.createElement("textarea")
        textarea.value = text
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
      }
      addToast("Container numbers copied to clipboard.", "success")
    } catch {
      addToast("Could not copy to clipboard. Please copy manually.", "error")
    }
  }

  const postAction = async (path: string, body: Record<string, any>, successMessage: string) => {
    if (!accessToken) return
    setBusy(true)
    try {
      const resp = await fetch(`/api/ship-containers/${container.id}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
      })
      const json = await resp.json().catch(() => null)
      if (!resp.ok) throw new Error(json?.message || "Action failed")
      addToast(successMessage, "success")
      router.reload()
    } catch (err: any) {
      addToast(err?.message || "Action failed", "error")
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="trezo-card-header bg-white mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
        <div className="trezo-card-title">
          <h5 className="!mb-0 flex items-center gap-2">
            {container.reference_number || `#${container.id}`}
            <span className={`px-2 py-0.5 rounded-md text-xs ${statusBadge(container.status)}`}>
              {SHIP_CONTAINER_STATUS_LABELS[container.status as keyof typeof SHIP_CONTAINER_STATUS_LABELS] || container.status}
            </span>
          </h5>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            {SHIP_CONTAINER_TYPE_LABELS[container.container_type]}
          </p>
        </div>
        <Link
          href="/ship-containers"
          className="inline-flex items-center gap-1 text-[13px] text-primary-500 hover:text-primary-600"
        >
          <i className="material-symbols-outlined !text-[18px]">arrow_back</i>
          Back to containers
        </Link>
      </div>

      {/* Transit deadline alerts */}
      {isTransit && container.transit?.needs_notification && !container.exit_date && (
        <div className="bg-warning-50 border border-warning-100 text-warning-900 rounded-md p-[15px] mb-[20px] text-[13px] flex items-center gap-2">
          <i className="material-symbols-outlined !text-[20px]">notification_important</i>
          Day {container.transit.day_number} of {container.transit.exit_days}: arrange extension of the clearing
          process and bond. Exit deadline{" "}
          <strong>{container.transit.deadline?.slice(0, 10)}</strong>
          {container.transit.days_remaining != null && <> — {container.transit.days_remaining} day(s) left.</>}
        </div>
      )}
      {isTransit && container.transit?.overdue && !container.exit_date && (
        <div className="bg-danger-50 border border-danger-100 text-danger-500 rounded-md p-[15px] mb-[20px] text-[13px] flex items-center gap-2">
          <i className="material-symbols-outlined !text-[20px]">error</i>
          The {container.transit.exit_days}-day transit window elapsed. Record the exit date or extend the bond.
        </div>
      )}

      {/* Core facts */}
      <div className="grid gap-[20px] md:grid-cols-2 mb-[25px]">
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <h6 className="text-[15px] text-black dark:text-white mb-[15px]">Summary</h6>
          <dl className="space-y-[10px] text-[13px]">
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 dark:text-gray-400">Reference</dt>
              <dd className="text-black dark:text-white">{container.reference_number || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 dark:text-gray-400">Client Name</dt>
              <dd className="text-black dark:text-white">{container.client_name || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 dark:text-gray-400">Linked Customer</dt>
              <dd className="text-black dark:text-white">
                {container.customer?.name
                  ? `${container.customer.name} (registered account)`
                  : "—"}
              </dd>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-[8px] sm:flex-row sm:justify-end sm:gap-3">
              <dt className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {container.container_numbers && container.container_numbers.length > 1 ? "Container Numbers" : "Container No"}
              </dt>
              <dd className="flex flex-wrap justify-end gap-[6px]">
                {container.container_numbers?.length ? (
                  <>
                    {container.container_numbers.map((number) => (
                      <span
                        key={number}
                        className="inline-block bg-primary-50 dark:bg-[#15203c] border border-primary-100 dark:border-[#1c2a4a] text-primary-700 dark:text-gray-200 rounded-md px-[8px] py-[3px] text-[12px] font-medium tracking-wide"
                        title={number}
                      >
                        {number}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => copyNumbers(container.container_numbers!)}
                      title="Copy all container numbers"
                      className="inline-flex items-center gap-[4px] bg-gray-50 dark:bg-[#15203c] border border-gray-100 dark:border-[#15203c] text-gray-600 dark:text-gray-300 rounded-md px-[8px] py-[3px] text-[12px] hover:text-primary-500 hover:border-primary-300 transition-all"
                    >
                      <i className="material-symbols-outlined !text-[14px]">content_copy</i>
                      Copy
                    </button>
                  </>
                ) : (
                  <span className="text-black dark:text-white">—</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 dark:text-gray-400">Qty</dt>
              <dd className="text-black dark:text-white">{container.container_numbers?.length ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 dark:text-gray-400">Category</dt>
              <dd className="text-black dark:text-white">{SHIP_CONTAINER_TYPE_LABELS[container.container_type]}</dd>
            </div>
            {config?.transit && (
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500 dark:text-gray-400">Exit deadline</dt>
                <dd className="text-black dark:text-white">{container.transit?.deadline?.slice(0, 10) || "—"}</dd>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 dark:text-gray-400">Recorded by</dt>
              <dd className="text-black dark:text-white">
                {container.created_by_user
                  ? `${container.created_by_user.first_name ?? ""} ${container.created_by_user.last_name ?? ""}`.trim()
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Movement capture (transit types only) */}
        {isTransit && (
          <Can any={["ROLE_EDIT_SHIP_CONTAINER"]}>
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <h6 className="text-[15px] text-black dark:text-white mb-[15px]">Entered / Exited the Country</h6>
            <div className="grid gap-[12px] sm:grid-cols-2">
              <div>
                <label className="mb-[6px] block text-[13px] font-medium text-black dark:text-white">Get In (entered country)</label>
                <input type="date" value={getIn} onChange={(e) => setGetIn(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-[6px] block text-[13px] font-medium text-black dark:text-white">Get Out (exited country)</label>
                <input
                  type="date"
                  value={container.get_out?.slice(0, 10) ?? ""}
                  disabled
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex gap-[10px] mt-[15px]">
              <button
                type="button"
                disabled={busy || !getIn}
                onClick={() => postAction("get-in", { get_in: getIn }, "Get In recorded")}
                className="text-[13px] text-white bg-primary-500 hover:bg-primary-600 py-[9px] px-[15px] rounded-md disabled:opacity-50"
              >
                Save Get In
              </button>
            </div>
            <p className="mt-[10px] text-[12px] text-gray-500 dark:text-gray-400">
              Get Out is set automatically when the exit date is recorded below.
            </p>

            {isTransit && (
              <div className="mt-[25px] pt-[20px] border-t border-gray-50 dark:border-[#15203c]">
                <h6 className="text-[15px] text-black dark:text-white mb-[10px]">Date of Exit (Kenya borders)</h6>
                {container.exit_date ? (
                  <p className="text-[13px] text-gray-500 dark:text-gray-400">
                    Exited on {container.exit_date.slice(0, 16).replace("T", " ")}
                    {container.exit_border ? ` at ${container.exit_border}` : ""}
                  </p>
                ) : (
                  <>
                    <div className="grid gap-[12px] sm:grid-cols-2">
                      <div>
                        <label className="mb-[6px] block text-[13px] font-medium text-black dark:text-white">
                          Exit date &amp; time
                        </label>
                        <input
                          type="datetime-local"
                          value={exitDate}
                          onChange={(e) => setExitDate(e.target.value)}
                          className={inputClass}
                          max={new Date().toISOString().slice(0, 16)}
                        />
                      </div>
                      <div>
                        <label className="mb-[6px] block text-[13px] font-medium text-black dark:text-white">
                          Border / exit point
                        </label>
                        <input
                          type="text"
                          value={exitBorder}
                          onChange={(e) => setExitBorder(e.target.value)}
                          placeholder="e.g. Malaba, Busia, Namanga"
                          className={inputClass}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-[6px] block text-[13px] font-medium text-black dark:text-white">
                          Remarks
                        </label>
                        <input
                          type="text"
                          value={exitRemarks}
                          onChange={(e) => setExitRemarks(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={busy || !exitDate}
                      onClick={() =>
                        postAction("record-exit", { exit_date: exitDate, exit_border: exitBorder, exit_remarks: exitRemarks }, "Exit recorded")
                      }
                      className="mt-[15px] text-[13px] text-white bg-danger-500 hover:bg-danger-600 py-[9px] px-[15px] rounded-md disabled:opacity-50"
                    >
                      Record Exit
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          </Can>
        )}
      </div>

      {/* Type-specific fields */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        <div className="p-[20px] md:p-[25px]">
          <h6 className="text-[15px] text-black dark:text-white mb-[15px]">Container Details</h6>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <tbody className="divide-y divide-gray-50 dark:divide-[#15203c]">
                {container.type_fields.map((field) => (
                  <tr key={field.attribute}>
                    <td className="py-[10px] px-[14px] text-gray-500 dark:text-gray-400 whitespace-nowrap align-top ltr:first:pl-0">
                      {field.label}
                      {field.required && <span className="text-danger-500 ml-1">*</span>}
                    </td>
                    <td className="py-[10px] px-[14px] text-black dark:text-white">
                      {field.type === "numbers" && Array.isArray(field.value) ? (
                        <div className="flex flex-wrap gap-[6px]">
                          {field.value.map((number) => (
                            <span
                              key={number}
                              className="inline-block bg-primary-50 dark:bg-[#15203c] border border-primary-100 dark:border-[#1c2a4a] text-primary-700 dark:text-gray-200 rounded-md px-[8px] py-[3px] text-[12px] font-medium tracking-wide"
                            >
                              {number}
                            </span>
                          ))}
                          {field.value.length > 0 && (
                            <button
                              type="button"
                              onClick={() => copyNumbers(field.value)}
                              title="Copy all container numbers"
                              className="inline-flex items-center gap-[4px] bg-gray-50 dark:bg-[#15203c] border border-gray-100 dark:border-[#15203c] text-gray-600 dark:text-gray-300 rounded-md px-[8px] py-[3px] text-[12px] hover:text-primary-500 hover:border-primary-300 transition-all"
                            >
                              <i className="material-symbols-outlined !text-[14px]">content_copy</i>
                              Copy
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="whitespace-nowrap">{displayValue(field.value, field.type)}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShipContainerDetail