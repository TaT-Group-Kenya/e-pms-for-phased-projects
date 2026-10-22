"use client"

import React from "react"
import type { FilterOption } from "../../hooks/useFilterOptions"

interface FilterSelectProps {
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  placeholder?: string
  /** Hide entirely when no options resolved (e.g. endpoint empty). */
  loading?: boolean
  className?: string
}

/**
 * Compact dropdown used in table filter bars. Sits on the same visual style
 * as the status selects already in the tables.
 */
const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = "All",
  loading = false,
  className = "",
}) => {
  const unique = options.filter(
    (opt, index, all) => all.findIndex((o) => o.value === opt.value) === index
  )

  if (loading) {
    return (
      <select
        disabled
        className={`bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md px-[13px] py-[6px] text-gray-500 dark:text-gray-400 outline-0 ${className}`}
      >
        <option>Loading…</option>
      </select>
    )
  }

  if (options.length === 0) return null

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md px-[13px] py-[6px] text-black dark:text-white outline-0 max-w-[190px] ${className}`}
    >
      <option value="all">{placeholder}</option>
      {unique.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export default FilterSelect