import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const url = new URL(`${base}/orders`)

    const resp = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
      },
      body: JSON.stringify(req.body),
    })

    const data = await resp.json()
    if (!resp.ok) {
      return res.status(resp.status).json({ message: data.message })
    }
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('create order error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
