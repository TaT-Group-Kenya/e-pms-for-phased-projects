import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

// GET /api/accounting-periods?fiscal_year=YYYY -> month grid for the year.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Method ${req.method} not allowed.` })
  }

  const url = new URL(`${base}/accounting-periods`)
  for (const [key, value] of Object.entries(req.query)) {
    if (Array.isArray(value)) url.searchParams.set(key, value.join(','))
    else if (value !== undefined) url.searchParams.set(key, value)
  }

  try {
    const resp = await fetch(url.toString(), {
      method: req.method,
      headers: {
        ...JSON_HEADERS,
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
    })
    const data = await resp.json().catch(() => null)
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('accounting-periods proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
