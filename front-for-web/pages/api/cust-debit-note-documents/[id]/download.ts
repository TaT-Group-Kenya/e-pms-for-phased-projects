import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })
  const id = req.query.id
  if (!id || Array.isArray(id)) return res.status(400).json({ message: 'Document ID is required' })
  try {
    const response = await fetch(`${base}/cust-debit-note-documents/${id}/download`, {
      headers: { Authorization: req.headers.authorization || '' },
    })
    if (!response.ok) {
      const data = await response.json().catch(() => null)
      return res.status(response.status).json(data || { message: 'Failed to download document' })
    }
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream')
    res.setHeader('Content-Disposition', response.headers.get('content-disposition') || 'attachment')
    return res.status(200).send(Buffer.from(await response.arrayBuffer()))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('cust debit note document download api error', error)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
