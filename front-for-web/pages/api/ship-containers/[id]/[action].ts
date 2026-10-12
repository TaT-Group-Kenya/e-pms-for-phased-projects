import type { NextApiRequest, NextApiResponse } from 'next'

import { assertConfigured, methodNotAllowed, proxiedHeaders } from '../../../../utils/shipContainerProxy'

type Action = 'get-in' | 'record-exit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)

  const base = assertConfigured(res)
  if (!base) return

  const { id, action } = req.query as { id?: string; action?: string }
  const allowed: Action[] = ['get-in', 'record-exit']

  if (!id || !action || !allowed.includes(action as Action)) {
    return res.status(400).json({ message: 'Valid id and action required' })
  }

  try {
    const resp = await fetch(`${base}/ship-containers/${id}/${action}`, {
      method: 'POST',
      headers: proxiedHeaders(req),
      body: JSON.stringify(req.body),
    })

    const data = await resp.json().catch(() => null)
    if (!resp.ok) {
      return res.status(resp.status).json(data?.errors ? data : { message: data?.message || 'Failed' })
    }

    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`ship-containers ${action} proxy error`, err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}