import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    let url = `${base}/payment-receiving-methods`
    const token = req.headers.authorization?.replace('Bearer ', '')

    const params = new URLSearchParams()
    Object.entries(req.query || {}).forEach(([key, value]) => {
      if (typeof value === 'string') {
        params.append(key, value)
      }
    })

    const qs = params.toString()
    if (qs) {
      url += `?${qs}`
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await resp.json()

    if (!resp.ok) {
      return res.status(resp.status).json(data.errors || data)
    }

    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('payment-receiving-methods list api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
