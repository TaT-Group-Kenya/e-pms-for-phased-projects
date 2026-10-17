import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  const id = req.query.id
  if (!id || Array.isArray(id)) return res.status(400).json({ message: 'Debit note ID is required' })
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const response = await fetch(`${base}/cust-debit-notes/${id}/send-email`, {
      method: 'POST',
      headers: { Authorization: req.headers.authorization || '' },
    })
    const data = await response.json().catch(() => null)
    return res.status(response.status).json(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('send customer debit note email api error', error)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
