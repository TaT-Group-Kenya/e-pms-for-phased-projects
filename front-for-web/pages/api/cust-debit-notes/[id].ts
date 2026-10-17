import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['GET', 'PUT', 'DELETE'].includes(req.method || '')) return res.status(405).json({ message: 'Method not allowed' })
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })
  const id = req.query.id
  if (!id || Array.isArray(id)) return res.status(400).json({ message: 'Debit note ID is required' })
  try {
    const response = await fetch(`${base}/cust-debit-notes/${id}`, {
      method: req.method,
      headers: { ...JSON_HEADERS, Authorization: req.headers.authorization || '' },
      ...(req.method === 'PUT' ? { body: JSON.stringify(req.body) } : {}),
    })
    if (response.status === 204) return res.status(204).end()
    const data = await response.json().catch(() => null)
    return res.status(response.status).json(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('cust debit note api error', error)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
