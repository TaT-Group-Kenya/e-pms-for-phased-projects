import type { NextApiRequest, NextApiResponse } from 'next'

export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })
  try {
    const url = `${base}/cust-debit-note-documents${req.method === 'GET' && req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`
    const headers: Record<string, string> = {}
    if (typeof req.headers.authorization === 'string') headers.Authorization = req.headers.authorization
    if (typeof req.headers['content-type'] === 'string') headers['Content-Type'] = req.headers['content-type']
    const response = await fetch(url, {
      method: req.method,
      headers,
      ...(req.method === 'POST' ? { body: req as any, duplex: 'half' as any } : {}),
    } as any)
    const data = await response.json().catch(() => null)
    return res.status(response.status).json(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('cust debit note documents api error', error)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
