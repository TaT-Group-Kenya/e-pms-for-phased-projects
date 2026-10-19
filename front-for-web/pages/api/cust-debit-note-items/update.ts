import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })
  const id = req.body?.id
  if (!id) return res.status(400).json({ message: 'Line item ID is required' })
  try {
    const response = await fetch(`${base}/cust-debit-note-items/${id}`, {
      method: 'PUT',
      headers: { ...JSON_HEADERS, Authorization: req.headers.authorization || '' },
      body: JSON.stringify(req.body),
    })
    const data = await response.json().catch(() => null)
    return res.status(response.status).json(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('cust debit note item update api error', error)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
