"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export type ListMeta = {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number | null
  to: number | null
}

export type ListFilters = Record<string, string>

export const PER_PAGE_OPTIONS = [15, 50, 100, 500]
export const DEFAULT_PER_PAGE = 15

const SEARCH_DEBOUNCE_MS = 350

/**
 * Owns everything a server-paginated listing needs: page, per-page, debounced
 * search and arbitrary filters, plus the fetch lifecycle (abort on change,
 * stale-response guard, Laravel `{data, meta}` parsing).
 *
 * Each table keeps its own columns/cells/actions — this only centralises the
 * query mechanics shared by ~16 listings.
 */
export function useListQuery<T>(
  /** URL of the paginated endpoint, e.g. /api/quotations/list */
  endpoint: string,
  options: {
    /** Access token; listing is skipped while absent. */
    accessToken?: string | null
    /** Initial filter values, e.g. `{ status: "all" }`. */
    initialFilters?: ListFilters
    /** Optional per-entity param always sent, e.g. `{ container_type }`. */
    fixedParams?: Record<string, string>
    /** Called with the error message when a fetch fails (e.g. toast sink). */
    onError?: (message: string) => void
  } = {}
) {
  const { accessToken, initialFilters = {}, fixedParams } = options

  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<ListFilters>(initialFilters)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)

  const [rows, setRows] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<ListMeta>({
    current_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
    last_page: 1,
    from: null,
    to: null,
  })

  const requestSequence = useRef(0)
  const onErrorRef = useRef<((message: string) => void) | undefined>(options.onError)

  // Keep the error callback fresh without retriggering fetches
  useEffect(() => {
    onErrorRef.current = options.onError
  }, [options.onError])

  // Debounce the raw input into the actual search term (350ms, resets page)
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchInput.trim()
      setSearchTerm((prev) => {
        if (prev !== next) setPage(1)
        return next
      })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchInput])

  const activeFilters = useMemo<ListFilters>(
    () => Object.fromEntries(Object.entries(filters).filter(([, v]) => v && v !== "all")),
    [filters]
  )
  const activeFiltersKey = JSON.stringify(activeFilters)

  const fetchList = useCallback(
    async (signal: AbortSignal) => {
      if (!accessToken) {
        setRows([])
        setMeta((prev) => ({ ...prev, total: 0, last_page: 1, current_page: 1, from: null, to: null }))
        setLoading(false)
        return
      }

      const requestId = ++requestSequence.current
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.append("page", String(page))
        params.append("per_page", String(perPage))
        if (searchTerm) params.append("search", searchTerm)
        Object.entries(activeFilters).forEach(([key, value]) => params.append(key, value))
        Object.entries(fixedParams || {}).forEach(([key, value]) => params.append(key, value))

        const resp = await fetch(`${endpoint}?${params.toString()}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
          signal,
        })

        // A newer request superseded this one; drop the stale payload
        if (requestId !== requestSequence.current) return

        const json = await resp.json().catch(() => null)
        if (!resp.ok) throw new Error(json?.message || "Failed to load data")

        // Resource::collection returns `{ data: [...], meta }` at the top
        // level; some proxies wrap it as `{ data: { data: [...], ...meta } }`.
        const list = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.data?.data)
            ? json.data.data
            : []

        const pagination = (Array.isArray(json?.data) ? json.meta || json : json?.data) || {}

        setRows(list)
        setMeta({
          current_page: Number(pagination.current_page) || page,
          per_page: Number(pagination.per_page) || perPage,
          total: Number(pagination.total) || 0,
          last_page: Math.max(1, Number(pagination.last_page) || 1),
          from: pagination.from ?? null,
          to: pagination.to ?? null,
        })
      } catch (err: any) {
        if (err?.name === "AbortError" || requestId !== requestSequence.current) return
        const message = err?.message || "Failed to load data"
        onErrorRef.current?.(message)
        setError(message)
        setRows([])
      } finally {
        if (requestId === requestSequence.current) setLoading(false)
      }
    },
    [accessToken, endpoint, page, perPage, searchTerm, activeFiltersKey, fixedParams]
  )

  useEffect(() => {
    const controller = new AbortController()
    void fetchList(controller.signal)
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchList])

  // Keep the pager within bounds when the result set shrinks (e.g. after delete)
  useEffect(() => {
    if (!loading && meta.last_page > 0 && page > meta.last_page) {
      setPage(meta.last_page)
    }
  }, [page, meta.last_page, loading])

  /** Change a filter and jump back to page 1. */
  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev }
      if (!value || value === "all") delete next[key]
      else next[key] = value
      return next
    })
    setPage(1)
  }, [])

  /** Replace per-page and jump back to page 1. */
  const changePerPage = useCallback((size: number) => {
    setPerPage(size)
    setPage(1)
  }, [])

  /** Force a refetch without changing any query state (e.g. after delete). */
  const refresh = useCallback(() => {
    setPage((p) => p)
    setFilters((f) => ({ ...f }))
  }, [])

  return {
    searchInput,
    setSearchInput,
    searchTerm,
    filters,
    setFilter,
    clearFilters: useCallback(() => {
      setFilters(() => ({}))
      setSearchInput("")
      setPage(1)
    }, []),
    page,
    setPage,
    perPage,
    changePerPage,
    rows,
    loading,
    error,
    meta,
    refresh,
  }
}

/**
 * Windowed page list with `…` gaps for long page counts, e.g.
 * `[1, "gap-lead", 4, 5, 6, "gap-tail", 20]`.
 */
export function usePageWindow(current: number, last: number) {
  return useMemo<(number | "gap-lead" | "gap-tail")[]>(() => {
    if (last <= 7) {
      const pages: number[] = []
      for (let i = 1; i <= last; i++) pages.push(i)
      return pages
    }

    const pages: Array<number | "gap-lead" | "gap-tail"> = [1]
    const start = Math.max(2, current - 2)
    const end = Math.min(last - 1, current + 2)

    if (start > 2) pages.push("gap-lead")
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < last - 1) pages.push("gap-tail")
    pages.push(last)

    return pages
  }, [current, last])
}