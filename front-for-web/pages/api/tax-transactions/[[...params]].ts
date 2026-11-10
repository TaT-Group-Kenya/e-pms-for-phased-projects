import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

/**
 * BFF proxy for the tax transactions ledger:
 *   GET /api/tax-transactions            -> paginated ledger rows (filters)
 *   GET /api/tax-transactions/:id        -> single row detail
 *   GET /api/tax-transactions/summary    -> totals grouped by direction/chart
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  const raw = req.query.params
  const segments = Array.isArray(raw) ? raw : raw ? [raw] : []
  const path = segments.join('/')
  const isSummary = path === 'summary'

  const url = new URL(
    isSummary
      ? `${base}/tax-transactions-summary`
      : `${base}/tax-transactions${path ? `/${path}` : ''}`,
  )

  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'params') continue
    if (Array.isArray(value)) url.searchParams.set(key, value.join(','))
    else if (value !== undefined) url.searchParams.set(key, value)
  }

  try {
    const auth = req.headers.authorization ?? ''
    const resp = await fetch(url.toString(), {
      method: req.method,
      headers: {
        ...JSON_HEADERS,
        ...(auth ? { Authorization: auth } : {}),
      },
    })

    const data = await resp.json().catch(() => null)
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('tax-transactions proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
