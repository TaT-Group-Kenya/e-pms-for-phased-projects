import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { page = 1, per_page = 15, customer_id, status, project_id } = req.query

    const url = new URL(`${base}/orders`)
    url.searchParams.append('page', String(page))
    url.searchParams.append('per_page', String(per_page))

    if (customer_id) url.searchParams.append('customer_id', String(customer_id))
    if (status) url.searchParams.append('status', String(status))
    if (project_id) url.searchParams.append('project_id', String(project_id))

    const resp = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
      },
    })

    const data = await resp.json()
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('fetch orders error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
