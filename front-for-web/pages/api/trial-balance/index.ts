import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  // POST /api/trial-balance -> generate a new run (create).
  // GET /api/trial-balance  -> paginated runs list with from/to filters.
  if (req.method !== 'POST' && req.method !== 'GET' && req.method !== 'DELETE') {
    return res.status(405).json({ message: `Method ${req.method} not allowed.` })
  }

  const url = new URL(`${base}/trial-balance`)

  for (const [key, value] of Object.entries(req.query)) {
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
      ...(req.method === 'POST' && req.body ? { body: JSON.stringify(req.body) } : {}),
    })

    const data = await resp.json().catch(() => null)
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('trial-balance proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
