import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { range = 'last_7_days', limit = 10 } = req.query
    const url = new URL(`${base}/dashboard/recent-orders`)
    if (range) url.searchParams.append('range', String(range))
    if (limit) url.searchParams.append('limit', String(limit))

    const resp = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
      },
    })

    const data = await resp.json().catch(() => null)
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('dashboard recent-orders error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
