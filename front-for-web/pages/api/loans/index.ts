import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['GET', 'POST'].includes(req.method || '')) {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    let url = `${base}/loans`
    if (req.method === 'GET') {
      const params = new URLSearchParams()
      const { page = 1, per_page = 50, account_id, status } = req.query
      params.append('page', String(page))
      params.append('per_page', String(per_page))
      if (account_id) params.append('account_id', String(account_id))
      if (status) params.append('status', String(status))
      url = `${url}?${params.toString()}`
    }

    const resp = await fetch(url, {
      method: req.method,
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: req.method === 'POST' ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) : undefined,
    })

    const data = await resp.json().catch(() => null)
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('loans api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}