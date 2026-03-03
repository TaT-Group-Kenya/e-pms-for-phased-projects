import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id, paymentId, ...payload } = req.body as {
      id?: number | string
      paymentId?: number | string
      [key: string]: any
    }

    if (!id || !paymentId) {
      return res.status(400).json({ message: 'Invoice ID and payment ID are required' })
    }

    const url = `${base}/cust-invoices/${id}/payments/${paymentId}`
    const token = req.headers.authorization?.replace('Bearer ', '')

    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await resp.json().catch(() => null)

    if (!resp.ok) {
      return res.status(resp.status).json(data || { message: 'Failed to update payment' })
    }

    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('cust-invoice update-payment api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
