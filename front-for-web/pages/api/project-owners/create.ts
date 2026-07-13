import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const url = `${base}/project-owners`
    const token = req.headers.authorization?.replace('Bearer ', '')

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      ...JSON_HEADERS,
    }

    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)

    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body,
    })

    const data = await resp.json()

    if (!resp.ok) {
      return res.status(resp.status).json(data.errors || data)
    }

    return res.status(resp.status).json(data)
  } catch (err) {
    console.error('create project owner error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
