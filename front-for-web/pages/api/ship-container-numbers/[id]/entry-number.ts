import type { NextApiRequest, NextApiResponse } from 'next'

import { assertConfigured, methodNotAllowed, proxiedHeaders } from '../../../../utils/shipContainerProxy'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return methodNotAllowed(res)

  const { id } = req.query as { id?: string }
  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ message: 'Valid ship container number ID required' })
  }

  const base = assertConfigured(res)
  if (!base) return

  try {
    const response = await fetch(`${base}/ship-container-numbers/${id}/entry-number`, {
      method: 'PATCH',
      headers: proxiedHeaders(req),
      body: JSON.stringify(req.body),
    })
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return res.status(response.status).json(data?.errors ? data : { message: data?.message || 'Failed to update entry number' })
    }

    return res.status(response.status).json(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('ship-container-number entry-number proxy error', error)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
