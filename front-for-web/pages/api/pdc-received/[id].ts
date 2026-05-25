import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id?: string }
  if (!id) return res.status(400).json({ message: 'ID required' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (req.method === 'GET') {
      const url = `${base}/pdc-received-customers/${id}`
      const resp = await fetch(url, {
        method: 'GET',
        headers: { ...JSON_HEADERS, Authorization: `Bearer ${token}` },
      })
      const data = await resp.json().catch(() => null)
      if (!resp.ok) return res.status(resp.status).json(data || { message: 'Failed' })
      return res.status(resp.status).json(data)
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const url = `${base}/pdc-received-customers/${id}`
      const resp = await fetch(url, {
        method: req.method,
        headers: { ...JSON_HEADERS, Authorization: `Bearer ${token}` },
        body: JSON.stringify(req.body),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) return res.status(resp.status).json(data || { message: 'Failed' })
      return res.status(resp.status).json(data)
    }

    if (req.method === 'POST' && (req.url || '').endsWith('/post-to-accounts')) {
      // handled by separate proxy; keep for completeness
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('pdc-received id proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
