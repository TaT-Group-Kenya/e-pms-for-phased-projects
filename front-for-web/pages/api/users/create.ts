import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
      Accept: 'application/json',
    }

    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type']
    }

    const url = `${base}/users`

    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: req as any,
      duplex: 'half',
    } as any)

    const contentType = resp.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      const text = await resp.text()
      console.error('Non-JSON response from backend:', text.substring(0, 200))
      return res.status(500).json({ message: 'Invalid response from server' })
    }

    const data = await resp.json()

    if (!resp.ok) {
      return res.status(resp.status).json(data.errors || data)
    }

    return res.status(resp.status).json(data)
  } catch (err) {
    console.error('create user error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
