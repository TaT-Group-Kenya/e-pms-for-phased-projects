import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method || ''
  // Catch-all params arrive as arrays; normalize to the first segment.
  const slugRaw = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug
  const action = ['disburse', 'repay'].find(
    (a: string) => method === 'POST' && String(slugRaw || '') === a,
  )

  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method) && !action) {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const idRaw = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
    if (!idRaw) return res.status(400).json({ message: 'Loan ID is required' })

    const token = req.headers.authorization?.replace('Bearer ', '')

    let url = `${base}/loans/${idRaw}`
    let upstreamMethod = method

    if (action) {
      url = `${base}/loans/${idRaw}/${action}`
      upstreamMethod = 'POST'
    }

    const resp = await fetch(url, {
      method: upstreamMethod,
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: upstreamMethod === 'POST' || upstreamMethod === 'PUT'
        ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body))
        : undefined,
    })

    const data = await resp.json().catch(() => null)
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('loan api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}