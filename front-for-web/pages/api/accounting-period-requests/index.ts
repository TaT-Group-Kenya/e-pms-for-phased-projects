import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

const ACTIONS = ['approve', 'reject', 'cancel'] as const

// POST /api/accounting-period-requests?request_id=..&action=approve|reject|cancel
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} not allowed.` })
  }

  const requestId = (req.query.request_id ?? (req.body?.id as string | undefined)) as string | undefined
  const action = (req.query.action ?? req.body?.action) as string | undefined

  if (!requestId || !action || !ACTIONS.includes(action as (typeof ACTIONS)[number])) {
    return res.status(400).json({ message: 'request_id and a valid action (approve|reject|cancel) are required.' })
  }

  try {
    const resp = await fetch(`${base}/accounting-period-requests/${requestId}/${action}`, {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
      body: JSON.stringify(req.body ?? {}),
    })
    const data = await resp.json().catch(() => null)
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('accounting-period-requests proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
