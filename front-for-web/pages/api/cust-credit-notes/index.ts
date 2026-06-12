import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  const token = req.headers.authorization?.replace('Bearer ', '')

  if (req.method === 'GET') {
    try {
      let url = `${base}/cust-credit-notes`

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

      const data = await resp.json().catch(() => null)

      if (!resp.ok) {
        return res
          .status(resp.status)
          .json({ message: data?.message || 'Failed to load customer credit notes' })
      }

      return res.status(resp.status).json(data)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('cust-credit-notes list api error', err)
      return res.status(500).json({ message: 'Proxy error' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
