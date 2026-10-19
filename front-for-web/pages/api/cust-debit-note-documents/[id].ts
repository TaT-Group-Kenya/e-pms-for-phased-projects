import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ message: 'Method not allowed' })
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })
  const id = req.query.id
  if (!id || Array.isArray(id)) return res.status(400).json({ message: 'Document ID is required' })
  try {
    const response = await fetch(`${base}/cust-debit-note-documents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: req.headers.authorization || '', Accept: 'application/json' },
    })
    if (response.status === 204) return res.status(204).end()
    const data = await response.json().catch(() => null)
    return res.status(response.status).json(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('cust debit note document delete api error', error)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
