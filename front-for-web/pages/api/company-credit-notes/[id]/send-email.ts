import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  const { id } = req.query
  if (!id) {
    return res.status(400).json({ message: 'Credit note ID is required' })
  }

  const url = `${base}/company-credit-notes/${id}/send-email`
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  const apiRes = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await apiRes.json().catch(() => null)
  if (!apiRes.ok) {
    return res.status(apiRes.status).json({ message: data?.message || 'Failed to send company credit note email' })
  }

  res.status(200).json(data)
}
