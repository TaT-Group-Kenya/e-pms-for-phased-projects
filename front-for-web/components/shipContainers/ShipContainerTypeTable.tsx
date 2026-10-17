"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { selectAccessToken } from "../../store/auth/selectors"
import { useToast } from "../../hooks/useToast"
import { ToastContainer } from "../common/Toast"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import {
  SHIP_CONTAINER_STATUSES,
  SHIP_CONTAINER_STATUS_LABELS,
  SHIP_CONTAINER_TYPE_COLUMNS,
  SHIP_CONTAINER_TYPE_CONFIGS,
  SHIP_CONTAINER_TYPE_FILTERS,
  SHIP_CONTAINER_TYPE_PLURAL,
  STATUS_BADGE_STYLES,
  transitLabel,
  type ListColumn,
  type ShipContainerStatus,
  type ShipContainerType,
} from "../../constants/shipContainers"

type ListRow = {
  id: number
  reference_number?: string | null
  container_type: ShipContainerType
  client_name?: string | null
  quoted?: boolean
  customer?: { name?: string } | null
  project_owner_id?: number | null
  container_identifier?: string | null
  container_numbers?: string[] | null
  container_number_details?: Array<{
    id?: number
    container_no: string
    size?: number | null
    size_unit?: string | null
    goods_description?: string | null
    entry_number?: string | null
  }> | null
  description?: string | null
  quantity?: string | number | null
  eta?: string | null
  etd?: string | null
  port_in?: string | null
  port_out?: string | null
  get_in?: string | null
  get_out?: string | null
  allocation_name?: string | null
  allocation_location?: { id?: number; name?: string } | null
  bl_no?: string | null
  bol_no?: string | null
  shipping_line?: string | null
  shipping_agent?: string | null
  vessel?: string | null
  entry_status?: string | null
  tr10_entry_status?: string | null
  tr12_entry_status?: string | null
  entry_number?: string | null
  booking_no?: string | null
  do_status?: string | null
  allocation?: string | number | null
  guarantee_status?: string | null
  gt_expiry_date?: string | null
  empty_status?: string | null
  person_incharge?: string | null
  status?: string | null
  last_free_day?: string | null
  cfs?: string | null
  cfs_location?: { id?: number; name?: string } | null
  destination?: string | null
  gt_expiration_date?: string | null
  exit_date?: string | null
  exit_border?: string | null
  location?: string | null
  goods_description?: string | null
  coe?: string | null
  chassis_no?: string | null
  registration_no?: string | null
  station?: string | null
  remarks?: string | null
  created_at?: string | null
  updated_at?: string | null
  created_by_user?: { first_name?: string; middle_name?: string; last_name?: string } | null
  updated_by_user?: { first_name?: string; middle_name?: string; last_name?: string } | null
  transit?: {
    day_number?: number | null
    days_remaining?: number | null
    deadline?: string | null
    overdue?: boolean
    needs_notification?: boolean
  } | null
}

type PaginationMeta = {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from?: number | null
  to?: number | null
}

/** Free-text search fields the backend `search` parameter covers. */
type ActiveFilter = { key: string; value: string }
const PER_PAGE_OPTIONS = [15, 50, 100, 500]
const DEFAULT_PER_PAGE = 15

const STATUS_SELECT_FIELDS = new Set([
  "entry_status",
  "tr10_entry_status",
  "tr12_entry_status",
  "do_status",
  "empty_status",
  "guarantee_status",
])

/** Date-only fields (ETA/ETD etc.); get_in/get_out render with their time portion */
const DATE_FIELDS = new Set([
  "eta",
  "etd",
  "last_free_day",
  "gt_expiration_date",
  "gt_expiry_date",
])

const statusBadge = (status: string): string =>
  STATUS_BADGE_STYLES[status] || "bg-gray-50 text-gray-500"

const fullName = (user?: { first_name?: string; middle_name?: string; last_name?: string } | null): string =>
  [user?.first_name, user?.middle_name, user?.last_name].filter(Boolean).join(" ") || "—"

const shortDate = (value?: string | null): string => {
  if (!value) return "—"
  return value.length > 10 ? value.slice(0, 10) : value
}

const shortDateTime = (value?: string | null): string => {
  if (!value) return "—"
  return value.replace("T", " ").slice(0, 16)
}

interface ShipContainerTypeTableProps {
  /** The container type listed and filtered by this table instance */
  containerType: ShipContainerType
}

/**
 * Reusable listing table for one container type. Each instance owns its own
 * search term, status/secondary filters, pagination state and data fetches
 * scoped to the given container type.
 */
const ShipContainerTypeTable: React.FC<ShipContainerTypeTableProps> = ({ containerType }) => {
  const accessToken = useSelector(selectAccessToken)
  const router = useRouter()
  const { toasts, addToast, removeToast } = useToast()

  const columns: ListColumn[] = SHIP_CONTAINER_TYPE_COLUMNS[containerType]
  const secondaryFilters = SHIP_CONTAINER_TYPE_FILTERS[containerType]

  // Stable filter object (key -> value) for this table instance
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [secondary, setSecondary] = useState<Record<string, string>>({})
  const [perPage, setPerPage] = useState<number>(DEFAULT_PER_PAGE)
  const [page, setPage] = useState(1)

  const [rows, setRows] = useState<ListRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
    last_page: 1,
    from: null,
    to: null,
  })
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; label: string } | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const requestSequence = useRef(0)

  const activeSecondary = useMemo<ActiveFilter[]>(
    () => Object.entries(secondary).filter(([, v]) => v && v !== "all").map(([key, value]) => ({ key, value })),
    [secondary]
  )

  // Debounce search input -> API search term (350ms); resets to page 1 on change
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchInput.trim()
      setSearchTerm((prev) => {
        if (prev !== next) setPage(1)
        return next
      })
    }, 350)

    return () => clearTimeout(timer)
  }, [searchInput])

  const pageWindow = useMemo<(number | "gap-lead" | "gap-tail")[]>(() => {
    const last = meta.last_page
    const current = meta.current_page
    const pages: Array<number | "gap-lead" | "gap-tail"> = []

    if (last <= 7) {
      for (let i = 1; i <= last; i++) pages.push(i)
      return pages
    }

    pages.push(1)
    const start = Math.max(2, current - 2)
    const end = Math.min(last - 1, current + 2)

    if (start > 2) pages.push("gap-lead")
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < last - 1) pages.push("gap-tail")
    pages.push(last)

    return pages
  }, [meta.current_page, meta.last_page])

  const fetchList = useCallback(
    async (signal: AbortSignal) => {
      if (!accessToken) return

      const requestId = ++requestSequence.current
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.append("page", String(page))
        params.append("per_page", String(perPage))
        params.append("container_type", containerType)
        if (containerType === "container_export" && statusFilter !== "all") params.append("status", statusFilter)
        if (searchTerm) params.append("search", searchTerm)
        activeSecondary.forEach(({ key, value }) => params.append(key, value))

        const resp = await fetch(`/api/ship-containers/list?${params.toString()}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
          signal,
        })

        // A newer request superseded this one; drop the stale payload
        if (requestId !== requestSequence.current) return

        const json = await resp.json().catch(() => null)
        if (!resp.ok) throw new Error(json?.message || "Failed to load containers")

        // Resource::collection returns `{ data: [...], links, meta }` at the top
        // level; some proxies wrap it as `{ data: { data: [...], ...meta } }`.
        const list = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.data?.data)
            ? json.data.data
            : []

        const pagination = Array.isArray(json?.data) ? json.meta ?? {} : json?.data ?? {}

        if (Array.isArray(json?.data) || Array.isArray(json?.data?.data)) {
          setRows(list)
          setMeta({
            current_page: Number(pagination.current_page) || 1,
            per_page: Number(pagination.per_page) || perPage,
            total: Number(pagination.total) || 0,
            last_page: Math.max(1, Number(pagination.last_page) || 1),
            from: pagination.from ?? null,
            to: pagination.to ?? null,
          })
        } else {
          setRows([])
          setMeta((prev) => ({ ...prev, total: 0, last_page: 1, current_page: 1, from: null, to: null }))
        }
      } catch (err: any) {
        if (err?.name === "AbortError" || requestId !== requestSequence.current) return
        addToast(err?.message || "Failed to load containers", "error")
        setError(err?.message || "Failed to load containers")
        setRows([])
      } finally {
        if (requestId === requestSequence.current) setLoading(false)
      }
    },
    // Dependency array keys pagination/filter/data identity
    [accessToken, page, perPage, containerType, statusFilter, searchTerm, activeSecondary, addToast]
  )

  useEffect(() => {
    const controller = new AbortController()
    void fetchList(controller.signal)
    return () => controller.abort()
  }, [fetchList])

  // Keep the pager within bounds when the result set shrinks (e.g. after filter/delete)
  useEffect(() => {
    if (!loading && meta.last_page > 0 && page > meta.last_page) {
      setPage(meta.last_page)
    }
  }, [page, meta.last_page, loading])

  const resetToFirstPage = (apply: () => void) => {
    apply()
    setPage(1)
  }

  const setSecondaryFilter = (key: string, value: string) => {
    resetToFirstPage(() =>
      setSecondary((prev) => {
        const next = { ...prev }
        if (!value || value === "all") {
          delete next[key]
        } else {
          next[key] = value
        }
        return next
      })
    )
  }

  const clearAllFilters = () => {
    setSearchInput("")
    setStatusFilter("all")
    setSecondary({})
    setPage(1)
  }

  const hasActiveFilters =
    (containerType === "container_export" && statusFilter !== "all") || activeSecondary.length > 0 || searchTerm !== ""

  const handleDelete = async () => {
    if (!deleteTarget || !accessToken) return
    setDeleting(true)
    setDeleteError(null)

    try {
      const resp = await fetch(`/api/ship-containers/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!resp.ok && resp.status !== 204) {
        const json = await resp.json().catch(() => null)
        throw new Error(json?.message || "Failed to delete")
      }
      addToast("Container deleted", "success")
      setDeleteTarget(null)

      // Moving back a page when the last row of the last page is deleted
      if (rows.length === 1 && page > 1) {
        setPage((p) => p - 1)
      } else {
        void fetchList(new AbortController().signal)
      }
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  const cellValue = (row: ListRow, key: string): React.ReactNode => {
    if (key === "reference_number") {
      return (
        <Link
          href={`/ship-containers/${row.id}`}
          className="text-primary-500 hover:text-primary-600 hover:underline font-medium"
          title="Open details"
        >
          {row.reference_number || "—"}
        </Link>
      )
    }

    if (key === "actions") {
      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/ship-containers/${row.id}`}
            className="text-primary-500 hover:text-primary-600"
            title="View/Edit"
          >
            <i className="material-symbols-outlined !text-[18px]">visibility</i>
          </Link>
          <button
            type="button"
            onClick={() =>
              setDeleteTarget({
                id: row.id,
                label: row.reference_number || row.container_identifier || `#${row.id}`,
              })
            }
            className="text-danger-500 hover:text-danger-600"
            title="Delete"
          >
            <i className="material-symbols-outlined !text-[18px]">delete</i>
          </button>
        </div>
      )
    }

    if (key === "exit_tracker") {
      if (!row.transit) return <span>—</span>
      const { days_remaining, overdue } = row.transit
      if (overdue) {
        return <span className="bg-danger-50 text-danger-500 px-2 py-0.5 rounded-md text-xs">Overdue</span>
      }
      return (
        <span className={(days_remaining ?? 99) <= 5 ? "text-warning-500 font-semibold" : ""}>
          {days_remaining != null ? `${days_remaining} day(s)` : "—"}
        </span>
      )
    }

    if (key === "status") {
      const status = row.status as ShipContainerStatus | undefined
      if (!status) return <span>—</span>
      return (
        <span className={`px-2 py-0.5 rounded-md text-xs ${statusBadge(status)}`}>
          {SHIP_CONTAINER_STATUS_LABELS[status] || status}
        </span>
      )
    }

    if (key === "customer") {
      return <span>{row.customer?.name || "—"}</span>
    }

    if (key === "client_name") {
      return <span>{row.client_name || "—"}</span>
    }

    if (key === "quoted") {
      return row.quoted
        ? <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">Quoted</span>
        : <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">Unquoted</span>
    }

    if (key === "container_numbers") {
      const containerNumbers =
        row.container_numbers ?? row.container_number_details?.map((number) => number.container_no) ?? []
      return <span>{containerNumbers.length ? containerNumbers.join(", ") : "—"}</span>
    }

    if (key === "allocation") {
      // Allocation stores a project-location id; render the location name
      const name = (row as unknown as { allocation_location?: { name?: string } | null })?.allocation_location?.name
      return <span>{name || "—"}</span>
    }

    if (key === "cfs") {
      return <span>{row.cfs_location?.name || row.cfs || "—"}</span>
    }

    if (key === "created_by_user" || key === "updated_by_user") {
      return <span>{fullName(row[key])}</span>
    }

    if (key === "created_at" || key === "updated_at" || key === "exit_date") {
      return <span title={row[key as "exit_date"] ?? undefined}>{shortDateTime(row[key as "exit_date"])}</span>
    }

    if (key === "get_in" || key === "get_out") {
      return <span title={row[key] ?? undefined}>{row[key] ? shortDateTime(row[key]) : "—"}</span>
    }

    if (DATE_FIELDS.has(key)) {
      return <span>{shortDate(row[key as "eta"])}</span>
    }

    if (STATUS_SELECT_FIELDS.has(key)) {
      const value = row[key as "entry_status"]
      return <span>{transitLabel(value) || "—"}</span>
    }

    const value = row[key as keyof ListRow]
    if (value == null || value === "") return <span>—</span>
    return <span>{String(value)}</span>
  }

  const firstRow = meta.from ?? (meta.total === 0 ? 0 : (meta.current_page - 1) * meta.per_page + 1)
  const lastRow = meta.to ?? Math.min(meta.total, meta.current_page * meta.per_page)

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Per-tab toolbar: search + status + type-specific filters. All server-side. */}
      <div className="bg-white dark:bg-[#0c1427] rounded-md p-5 mb-[20px] flex flex-col xl:flex-row xl:items-center gap-[15px]">
        <div className="relative flex-1 min-w-[220px] md:max-w-[340px]">
          <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
            <i className="material-symbols-outlined !text-[20px]">search</i>
          </label>
          <input
            type="text"
            placeholder="Search ref, client, container no..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              title="Clear search"
              className="absolute ltr:right-[10px] rtl:left-[10px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-danger-500"
            >
              <i className="material-symbols-outlined !text-[16px]">cancel</i>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-[10px]">
          {containerType === "container_export" && (
            <select
              value={statusFilter}
              onChange={(e) => {
                resetToFirstPage(() => setStatusFilter(e.target.value))
              }}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md md:w-[190px] block text-black dark:text-white px-[13px] outline-0"
            >
              <option value="all">All Status</option>
              {SHIP_CONTAINER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {SHIP_CONTAINER_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          )}

          {secondaryFilters.map((filter) => (
            <select
              key={filter.key}
              value={secondary[filter.key] ?? "all"}
              onChange={(e) => setSecondaryFilter(filter.key, e.target.value)}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md md:w-[170px] block text-black dark:text-white px-[13px] outline-0"
            >
              <option value="all">All {filter.label}</option>
              {filter.options.map((option) => (
                <option key={option} value={option}>
                  {transitLabel(option)}
                </option>
              ))}
            </select>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs text-danger-500 hover:text-danger-600"
            >
              <i className="material-symbols-outlined !text-[16px]">filter_alt_off</i>
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 dark:bg-[#15203c]">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-[13px] font-medium text-black dark:text-white py-[12px] px-[14px] text-left ltr:first:pl-[20px] rtl:first:pr-[20px] whitespace-nowrap ${
                      col.align === "end" ? "text-right" : ""
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-[#15203c]">
              {loading ? (
                [...Array(Math.min(perPage, 10))].map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    {columns.map((col) => (
                      <td key={col.key} className="py-[14px] px-[14px]">
                        <div className="h-[12px] bg-gray-100 dark:bg-[#1c2a4a] rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-[40px] text-center text-gray-500 dark:text-gray-400">
                    {error
                      ? error
                      : hasActiveFilters || searchTerm
                        ? `No ${SHIP_CONTAINER_TYPE_PLURAL[containerType]} match the current filters.`
                        : `No ${SHIP_CONTAINER_TYPE_PLURAL[containerType]} registered yet.`}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors">
                    {columns.map((col) => {
                      const raw = row[col.key as keyof ListRow]
                      const text =
                        col.key === "description" ||
                        col.key === "goods_description" ||
                        col.key === "remarks"
                          ? raw == null || raw === ""
                            ? "—"
                            : String(raw)
                          : null

                      return (
                        <td
                          key={col.key}
                          className={`py-[12px] px-[14px] text-[13px] text-black dark:text-white ltr:first:pl-[20px] rtl:first:pr-[20px] ${
                            col.align === "end" ? "text-right" : ""
                          } ${col.truncate ? "max-w-[260px]" : "whitespace-nowrap"}`}
                        >
                          {col.truncate ? (
                            <span title={text ?? undefined} className="block truncate max-w-[260px]">
                              {text}
                            </span>
                          ) : (
                            cellValue(row, col.key)
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-[12px] p-[15px] border-t border-gray-50 dark:border-[#15203c]">
          <div className="flex items-center gap-[12px] text-xs text-gray-500 dark:text-gray-400">
            <span>{meta.total > 0 ? `Showing ${firstRow}–${lastRow} of ${meta.total}` : "No results"}</span>
            <label className="flex items-center gap-[8px] ml-[8px]">
              <span className="whitespace-nowrap">Per page</span>
              <select
                value={perPage}
                onChange={(e) => {
                  resetToFirstPage(() => setPerPage(Number(e.target.value)))
                }}
                className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[32px] text-xs rounded-md text-black dark:text-white px-[10px] outline-0"
              >
                {PER_PAGE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {meta.last_page > 1 && (
            <div className="flex items-center gap-[6px]">
              <button
                type="button"
                disabled={meta.current_page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-[10px] py-[6px] text-xs rounded-md border border-gray-100 dark:border-[#15203c] text-black dark:text-white disabled:opacity-40 hover:border-primary-500"
              >
                Prev
              </button>

              {pageWindow.map((entry, index) =>
                entry === "gap-lead" || entry === "gap-tail" ? (
                  <span key={`gap-${index}`} className="px-[6px] text-xs text-gray-400 select-none">
                    …
                  </span>
                ) : (
                  <button
                    key={entry}
                    type="button"
                    disabled={loading}
                    onClick={() => setPage(entry)}
                    className={`px-[12px] py-[6px] text-xs rounded-md border transition-colors ${
                      entry === meta.current_page
                        ? "bg-primary-500 text-white border-primary-500"
                        : "border-gray-100 dark:border-[#15203c] text-black dark:text-white hover:border-primary-500"
                    }`}
                  >
                    {entry}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={meta.current_page >= meta.last_page || loading}
                onClick={() => setPage((p) => p + 1)}
                className="px-[10px] py-[6px] text-xs rounded-md border border-gray-100 dark:border-[#15203c] text-black dark:text-white disabled:opacity-40 hover:border-primary-500"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <DeleteConfirmationModal
          isOpen={!!deleteTarget}
          title="Delete Container"
          message={`Are you sure you want to delete container ${deleteTarget.label}? This hides it from listings (soft delete).`}
          itemName={deleteTarget.label}
          error={deleteError}
          isDeleting={deleting}
          onConfirm={handleDelete}
          onCancel={() => {
            setDeleteTarget(null)
            setDeleteError(null)
          }}
        />
      )}
    </>
  )
}

export default ShipContainerTypeTable