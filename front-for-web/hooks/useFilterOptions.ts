"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type FilterOption = {
  value: string
  label: string
}

/**
 * Loads the option list for a filter dropdown once, from a listing endpoint
 * that already returns Resource-shaped rows (either `{ data: [...] }` or a
 * bare array). Small reference lists (customers, containers, categories…)
 * only; keeps each table's filter select self-contained.
 */
export function useFilterOptions(
  endpoint: string | null,
  mapRow: (row: any) => FilterOption | null,
  options: { enabled?: boolean; accessToken?: string | null } = {}
) {
  const { enabled = true, accessToken } = options

  const [items, setItems] = useState<FilterOption[]>([])
  const [loading, setLoading] = useState(false)
  const mapRowRef = useRef(mapRow)

  useEffect(() => {
    mapRowRef.current = mapRow
  }, [mapRow])

  const load = useCallback(async () => {
    if (!endpoint || !enabled || !accessToken) return
    setLoading(true)
    try {
      const resp = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const json = await resp.json().catch(() => null)
      if (!resp.ok) return
      const list = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.data?.data)
          ? json.data.data
          : Array.isArray(json)
            ? json
            : []
      const mapped = (list || []).map((row: any) => mapRowRef.current(row)).filter(Boolean) as FilterOption[]
      // De-duplicate (e.g. country lists come one-per-row)
      const seen = new Set<string>()
      const unique = mapped.filter((opt) => {
        if (seen.has(opt.value)) return false
        seen.add(opt.value)
        return true
      })
      setItems(unique)
    } catch {
      // dropdown options are best-effort; the table still works without them
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, enabled, accessToken])

  useEffect(() => {
    void load()
  }, [load])

  return { options: items, loading, reload: load }
}