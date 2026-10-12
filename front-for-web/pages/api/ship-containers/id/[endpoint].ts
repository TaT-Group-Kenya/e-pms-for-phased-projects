import type { NextApiRequest, NextApiResponse } from 'next'

import { assertConfigured, methodNotAllowed, proxiedHeaders } from '../../../../utils/shipContainerProxy'

type Endpoint = 'transit-notifications' | 'statistics'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res)

  const base = assertConfigured(res)
  if (!base) return

  const { endpoint } = req.query as { endpoint?: string }
  if (!endpoint || !['transit-notifications', 'statistics'].includes(endpoint)) {
    return res.status(400).json({ message: 'Valid endpoint required' })
  }

  try {
    const resp = await fetch(`${base}/ship-containers-${endpoint}`, { method: 'GET', headers: proxiedHeaders(req) })
    const data = await resp.json().catch(() => null)
    if (!resp.ok) return res.status(resp.status).json({ message: data?.message || 'Failed to fetch' })

    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`ship-containers ${endpoint} proxy error`, err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}