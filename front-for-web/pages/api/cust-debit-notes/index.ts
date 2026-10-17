import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })
  try {
    const params = new URLSearchParams()
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === 'string') params.append(key, value)
    })
    const url = `${base}/cust-debit-notes${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(url, {
      headers: {
        ...JSON_HEADERS,
        Authorization: req.headers.authorization || '',
      },
    })
    const data = await response.json().catch(() => null)
    return res.status(response.status).json(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('cust debit notes list api error', error)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
