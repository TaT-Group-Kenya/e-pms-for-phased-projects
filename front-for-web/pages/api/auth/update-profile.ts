import type { NextApiRequest, NextApiResponse } from 'next'

import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const resp = await fetch(`${base}/me/profile`, {
      method: 'PUT',
      headers: {
        ...JSON_HEADERS,
        Authorization: authHeader,
      },
      body: JSON.stringify(req.body),
    })

    const data = await resp.json().catch(() => null)
    return res.status(resp.status).json(data ?? {})
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('update-profile proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
