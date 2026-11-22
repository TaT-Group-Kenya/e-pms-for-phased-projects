import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../../constants/headers'

// POST /api/accounting-periods/:id/reopen { reason }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} not allowed.` })
  }

  const { id } = req.query
  try {
    const resp = await fetch(`${base}/accounting-periods/${id}/reopen`, {
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
    console.error('accounting-periods reopen proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
