import type { NextApiRequest, NextApiResponse } from 'next'

import { assertConfigured, methodNotAllowed, proxiedHeaders } from '../../../utils/shipContainerProxy'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res)

  const base = assertConfigured(res)
  if (!base) return

  try {
    const params = new URLSearchParams()
    Object.entries(req.query || {}).forEach(([key, value]) => {
      if (typeof value === 'string') params.append(key, value)
    })

    const qs = params.toString()
    const url = `${base}/ship-containers${qs ? `?${qs}` : ''}`

    const resp = await fetch(url, { method: 'GET', headers: proxiedHeaders(req) })
    const data = await resp.json().catch(() => null)
    if (!resp.ok) return res.status(resp.status).json({ message: data?.message || 'Failed to fetch' })

    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('ship-containers list proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}