import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  if (req.method !== 'POST') return res.status(405).end()

  try {
    const backendRes = await fetch(`${base}/forgot-password`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(req.body),
    })
    const contentType = backendRes.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await backendRes.json()
      return res.status(backendRes.status).json(data)
    }else {
      const text = await backendRes.text()
      return res.status(backendRes.status).json({ message: text })
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Server error' })
  }
}
