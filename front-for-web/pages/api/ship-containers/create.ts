import type { NextApiRequest, NextApiResponse } from 'next'

import { assertConfigured, methodNotAllowed, proxiedHeaders } from '../../../utils/shipContainerProxy'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const base = assertConfigured(res)
  if (!base) return

  try {
    const resp = await fetch(`${base}/ship-containers`, {
      method: 'POST',
      headers: proxiedHeaders(req),
      body: JSON.stringify(req.body),
    })

    const data = await resp.json().catch(() => null)
    if (!resp.ok) {
      return res.status(resp.status).json(data?.errors ? data : { message: data?.message || 'Failed to create' })
    }

    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('ship-containers create proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}