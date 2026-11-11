import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

/**
 * BFF proxy for the lenders CRUD:
 *   GET /api/lenders             -> paginated list (search param)
 *   GET /api/lenders/:id         -> single
 *   POST /api/lenders            -> create
 *   PUT /api/lenders/:id         -> update
 *   DELETE /api/lenders/:id      -> soft delete
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  const raw = req.query.params
  const path = (Array.isArray(raw) ? raw.join('/') : typeof raw === 'string' ? raw : '')
    ? `/${(Array.isArray(raw) ? raw.join('/') : raw) as string}`
    : ''

  const url = new URL(`${base}/lenders${path}`)

  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'params') continue
    if (Array.isArray(value)) url.searchParams.set(key, value.join(','))
    else if (value !== undefined) url.searchParams.set(key, value)
  }

  try {
    const auth = req.headers.authorization ?? ''
    const resp = await fetch(url.toString(), {
      method: req.method ?? 'GET',
      headers: {
        ...JSON_HEADERS,
        ...(auth ? { Authorization: auth } : {}),
      },
      ...(req.body ? { body: JSON.stringify(req.body) } : {}),
    })

    const data = await resp.json().catch(() => null)
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('lenders proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
