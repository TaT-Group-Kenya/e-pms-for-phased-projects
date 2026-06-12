import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.body as { id?: number | string }

    if (!id) {
      return res.status(400).json({ message: 'Order ID is required' })
    }

    const url = `${base}/orders/${id}/unapprove`
    const token = req.headers.authorization?.replace('Bearer ', '')

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await resp.json().catch(() => null)

    if (!resp.ok) {
      return res.status(resp.status).json({ message: data?.message || 'Failed to unapprove order' })
    }

    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('order unapprove api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
