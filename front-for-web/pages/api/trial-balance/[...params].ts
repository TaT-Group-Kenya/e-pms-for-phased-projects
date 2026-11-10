import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

const BASE_PATH = `${process.env.EPMS_API_BASE}/trial-balance`

function segments(req: NextApiRequest): string[] {
  // [...params].ts exposes the path segments under req.query.params.
  const raw = req.query.params
  if (Array.isArray(raw)) return raw.filter((s): s is string => typeof s === 'string')
  if (typeof raw === 'string') return [raw]

  return []
}

async function proxy(req: NextApiRequest, res: NextApiResponse, path: string, passThroughBody = false) {
  const url = new URL(`${BASE_PATH}${path}`)

  // Forward query string (filters, pagination) — ignore the reserved keys.
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
      ...(passThroughBody && req.body ? { body: JSON.stringify(req.body) } : {}),
    })

    // Binary exports pass through raw.
    const contentType = resp.headers.get('content-type') ?? ''
    if (contentType.includes('application/pdf') || contentType.includes('text/csv')) {
      const buffer = Buffer.from(await resp.arrayBuffer())
      res.setHeader('Content-Type', contentType)
      res.setHeader(
        'Content-Disposition',
        resp.headers.get('content-disposition') ?? 'attachment',
      )
      return res.status(resp.status).send(buffer)
    }

    const data = await resp.json().catch(() => null)
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('trial-balance proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const [id, rest] = segments(req)

  // POST /api/trial-balance -> treated by index.ts; if reached here, proxy as create.
  if (req.method === 'POST' && !id) return proxy(req, res, '', true)

  if (id) {
    // GET /api/trial-balance/:id/lines | export.csv | export.pdf
    if (rest === 'lines') return proxy(req, res, `/${id}/lines`)
    if (rest === 'export.csv') return proxy(req, res, `/${id}/export-csv`)
    if (rest === 'export.pdf') return proxy(req, res, `/${id}/export-pdf`)

    // GET /api/trial-balance/:id -> presented snapshot (run + lines + totals)
    return proxy(req, res, `/${id}`)
  }

  // Fallback: proxy the runs list.
  return proxy(req, res, '')
}
