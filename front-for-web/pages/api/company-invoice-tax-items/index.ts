import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  const token = req.headers.authorization?.replace('Bearer ', '')

  if (req.method === 'POST') {
    try {
      const url = `${base}/company-invoice-tax-items`

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(req.body),
      })

      const data = await resp.json().catch(() => null)

      if (!resp.ok) {
        return res
          .status(resp.status)
          .json(data?.errors || data || { message: 'Failed to create company invoice tax item' })
      }

      return res.status(resp.status).json(data)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('company-invoice-tax-items create api error', err)
      return res.status(500).json({ message: 'Proxy error' })
    }
  }

  if (req.method === 'GET') {
    try {
      let url = `${base}/company-invoice-tax-items`

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
          .json(data?.errors || data || { message: 'Failed to load company invoice tax items' })
      }

      return res.status(resp.status).json(data)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('company-invoice-tax-items list api error', err)
      return res.status(500).json({ message: 'Proxy error' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
