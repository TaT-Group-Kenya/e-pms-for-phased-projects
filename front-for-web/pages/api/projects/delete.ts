import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Project ID is required' })
    }

    const url = `${base}/projects/${id}`

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
      },
    })

    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json({ message: data.message })
    }

    return res.status(resp.status).json({ message: 'Project deleted successfully' })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('delete project error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
