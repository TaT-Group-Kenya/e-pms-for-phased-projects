import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

/**
 * BFF proxy for monthly tax bills:
 *   GET  /api/tax-bills              -> bills list (report shape)
 *   POST /api/tax-bills/run          -> run a monthly VAT bill
 *   GET  /api/tax-bills/:id          -> bill detail + per-document lines
 *   POST /api/tax-bills/:id/pay      -> settle the bill in one installment
 *   GET  /api/tax-bills/:id/export-pdf -> PDF export (binary passthrough)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  const raw = req.query.params
  const segments = Array.isArray(raw) ? raw : raw ? [raw] : []
  const isPdf = segments.length === 2 && segments[1] === 'export-pdf'

  const path = segments.join('/')
  const url = new URL(`${base}/tax-bills${path ? `/${path}` : ''}`)

  try {
    const auth = req.headers.authorization ?? ''

    if (isPdf) {
      const resp = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: auth, Accept: 'application/pdf' },
      })

      if (!resp.ok) {
        const errorBody = await resp.json().catch(() => null)
        return res
          .status(resp.status)
          .json(errorBody || { message: `Failed to export tax bill PDF (status ${resp.status})` })
      }

      const arrayBuffer = await resp.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      res.setHeader('Content-Type', resp.headers.get('content-type') || 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        resp.headers.get('content-disposition') || `attachment; filename="tax-bill-${segments[0]}.pdf"`,
      )
      return res.end(buffer)
    }

    for (const [key, value] of Object.entries(req.query)) {
      if (key === 'params') continue
      if (Array.isArray(value)) url.searchParams.set(key, value.join(','))
      else if (value !== undefined) url.searchParams.set(key, value)
    }

    const resp = await fetch(url.toString(), {
      method: req.method,
      headers: {
        ...JSON_HEADERS,
        ...(auth ? { Authorization: auth } : {}),
      },
      body: req.method === 'POST' ? JSON.stringify(req.body ?? {}) : undefined,
    })

    const data = await resp.json().catch(() => null)
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('tax-bills proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
