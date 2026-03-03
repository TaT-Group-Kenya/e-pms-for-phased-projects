import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ message: 'Account ID is required' })

    const url = `${base}/accounts/${id}/topup`
    const token = req.headers.authorization?.replace('Bearer ', '')

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
    })

    const data = await resp.json().catch(() => null)

    if (!resp.ok) {
      const message =
        typeof data === 'string'
          ? data
          : data?.message || 'Failed to top up account'
      return res.status(resp.status).json({ message, details: data })
    }

    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('account topup proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
