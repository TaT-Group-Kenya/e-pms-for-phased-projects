import type { NextApiRequest, NextApiResponse } from 'next'

// Disable the default body parser so we can stream
// both JSON and multipart/form-data bodies directly to Laravel.
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    // Stream POST bodies (JSON or multipart) directly to Laravel
    if (req.method === 'GET') {
      const params = new URLSearchParams(req.query as Record<string, string>)
      const url = `${base}/company-invoice-documents${params.toString() ? `?${params.toString()}` : ''}`

      const token = req.headers.authorization?.replace('Bearer ', '')
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          Accept: 'application/json',
        },
      })

      const data = await resp.json().catch(() => null)
      if (!resp.ok) return res.status(resp.status).json(data?.errors || data || { message: 'Failed to load documents' })
      return res.status(resp.status).json(data)
    }

    if (req.method === 'POST') {
      const targetUrl = `${base}/company-invoice-documents`

      const contentType = req.headers['content-type']
      const authorization = req.headers['authorization']

      const headers: Record<string, string> = {}
      if (typeof contentType === 'string') headers['Content-Type'] = contentType
      if (typeof authorization === 'string') headers['Authorization'] = authorization

      const resp = await fetch(targetUrl, {
        method: 'POST',
        body: req as any,
        headers,
        // Required for Node.js fetch when sending a streamed body
        // from a server environment.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        duplex: 'half',
      } as any)

      const data = await resp.json().catch(() => null)
      if (!resp.ok) return res.status(resp.status).json(data?.errors || data || { message: 'Failed to create document' })
      return res.status(resp.status).json(data)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('company-invoice-documents index api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
