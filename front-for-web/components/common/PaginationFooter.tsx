"use client"

import React from "react"
import type { ListMeta } from "../../hooks/useListQuery"
import { PER_PAGE_OPTIONS, usePageWindow } from "../../hooks/useListQuery"

interface PaginationFooterProps {
  meta: ListMeta
  page: number
  perPage: number
  loading?: boolean
  onPageChange: (page: number) => void
  onPerPageChange: (size: number) => void
  /** Plural noun shown in "No results" state is handled by the table; this is just the count text. */
}

/**
 * Bottom bar shared by server-paginated listing tables: "Showing x–y of z",
 * per-page selector and a windowed pager with `…` gaps. Matches the footer
 * of the ShipContainerTypeTable listings.
 */
const PaginationFooter: React.FC<PaginationFooterProps> = ({
  meta,
  page,
  perPage,
  loading = false,
  onPageChange,
  onPerPageChange,
}) => {
  const pageWindow = usePageWindow(meta.current_page, meta.last_page)

  const firstRow = meta.total > 0 ? (meta.current_page - 1) * meta.per_page + 1 : 0
  const lastRow = meta.total > 0 ? Math.min(meta.current_page * meta.per_page, meta.total) : 0

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-[12px] p-[15px] border-t border-gray-50 dark:border-[#15203c]">
      <div className="flex items-center gap-[12px] text-xs text-gray-500 dark:text-gray-400">
        <span>{meta.total > 0 ? `Showing ${firstRow}–${lastRow} of ${meta.total}` : "No results"}</span>
        <label className="flex items-center gap-[8px] ml-[8px]">
          <span className="whitespace-nowrap">Per page</span>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
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
            onClick={() => onPageChange(Math.max(1, page - 1))}
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
                onClick={() => onPageChange(entry)}
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
            onClick={() => onPageChange(page + 1)}
            className="px-[10px] py-[6px] text-xs rounded-md border border-gray-100 dark:border-[#15203c] text-black dark:text-white disabled:opacity-40 hover:border-primary-500"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default PaginationFooter