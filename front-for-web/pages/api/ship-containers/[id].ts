import type { NextApiRequest, NextApiResponse } from 'next'

import { assertConfigured, methodNotAllowed, proxiedHeaders } from '../../../utils/shipContainerProxy'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id?: string }
  if (!id) return res.status(400).json({ message: 'ID required' })

  const base = assertConfigured(res)
  if (!base) return

  const url = `${base}/ship-containers/${id}`

  try {
    if (req.method === 'GET') {
      const resp = await fetch(url, { method: 'GET', headers: proxiedHeaders(req) })
      const data = await resp.json().catch(() => null)
      if (!resp.ok) return res.status(resp.status).json({ message: data?.message || 'Failed to fetch' })
      return res.status(resp.status).json(data)
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const resp = await fetch(url, {
        method: req.method,
        headers: proxiedHeaders(req),
        body: JSON.stringify(req.body),
      })
      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        return res.status(resp.status).json(data?.errors ? data : { message: data?.message || 'Failed to update' })
      }
      return res.status(resp.status).json(data)
    }

    if (req.method === 'DELETE') {
      const resp = await fetch(url, { method: 'DELETE', headers: proxiedHeaders(req) })
      if (!resp.ok) {
        const data = await resp.json().catch(() => null)
        return res.status(resp.status).json({ message: data?.message || 'Failed to delete' })
      }
      return res.status(204).end()
    }

    return methodNotAllowed(res)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('ship-containers id proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}