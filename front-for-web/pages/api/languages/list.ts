import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { page = 1, per_page = 15 } = req.query

    const url = new URL(`${base}/languages`)
    url.searchParams.append('page', String(page))
    url.searchParams.append('per_page', String(per_page))

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
    console.error('fetch languages error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
