import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT' && req.method !== 'PATCH') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.query

    if (!id) return res.status(400).json({ message: 'Department ID is required' })

    const url = new URL(`${base}/departments/${id}`)

    const resp = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
      },
      body: JSON.stringify(req.body),
    })

    const data = await resp.json()
    return res.status(resp.status).json(data)
  } catch (err) {
    console.error('update department error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
