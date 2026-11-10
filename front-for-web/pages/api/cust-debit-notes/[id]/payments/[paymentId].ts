import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  const { id, paymentId } = req.query
  if (!id || Array.isArray(id) || !paymentId || Array.isArray(paymentId)) {
    return res.status(400).json({ message: 'Debit note ID and payment ID are required' })
  }

  try {
    const url = `${base}/cust-debit-notes/${id}/payments/${paymentId}`
    const token = req.headers.authorization?.replace('Bearer ', '')

    const resp = await fetch(url, {
      method: req.method,
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      ...(req.method === 'PATCH' ? { body: JSON.stringify(req.body) } : {}),
    })

    if (resp.status === 204) return res.status(204).end()

    const data = await resp.json().catch(() => null)

    if (!resp.ok) {
      return res.status(resp.status).json(data || { message: 'Failed to update payment' })
    }

    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('cust-debit-note payment api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}