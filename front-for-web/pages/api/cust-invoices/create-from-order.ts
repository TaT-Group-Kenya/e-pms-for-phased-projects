import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const rawBodyOrderId = (req.body as any)?.order_id
    const rawQueryOrderId = req.query.order_id

    const orderId =
      (typeof rawBodyOrderId === 'string' || typeof rawBodyOrderId === 'number'
        ? String(rawBodyOrderId)
        : undefined) ||
      (typeof rawQueryOrderId === 'string' || typeof rawQueryOrderId === 'number'
        ? String(rawQueryOrderId)
        : undefined)

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' })
    }

    const url = `${base}/cust-invoices/create-from-order`
    const token = req.headers.authorization?.replace('Bearer ', '')

    const { title, description, payment_terms, notes_to_customer } = (req.body || {}) as any

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        title,
        description,
        payment_terms,
        notes_to_customer,
      }),
    })

    const data = await resp.json().catch(() => null)

    if (!resp.ok) {
      return res.status(resp.status).json(data || { message: 'Failed to generate invoice from order' })
    }

    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('create invoice from order api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
