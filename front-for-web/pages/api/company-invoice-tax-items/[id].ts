import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method || 'GET'
  if (!['GET', 'PUT', 'DELETE'].includes(method)) {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  const { id } = req.query
  if (!id) {
    return res.status(400).json({ message: 'Tax item ID is required' })
  }

  const url = `${base}/company-invoice-tax-items/${id}`
  const token = req.headers.authorization?.replace('Bearer ', '')

  try {
    if (method === 'GET') {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        return res.status(resp.status).json(data?.errors || data || { message: 'Failed to load company invoice tax item' })
      }

      return res.status(resp.status).json(data)
    }

    if (method === 'PUT') {
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
        body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        return res.status(resp.status).json(data?.errors || data || { message: 'Failed to update company invoice tax item' })
      }

      return res.status(resp.status).json(data)
    }

    if (method === 'DELETE') {
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      })

      if (!resp.ok) {
        const data = await resp.json().catch(() => null)
        return res.status(resp.status).json(data?.errors || data || { message: 'Failed to delete company invoice tax item' })
      }

      return res.status(resp.status || 200).json({ message: 'Company invoice tax item deleted successfully' })
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('company-invoice-tax-items id api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
