import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })
  const id = req.query.id
  if (!id || Array.isArray(id)) return res.status(400).json({ message: 'Debit note ID is required' })
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const response = await fetch(`${base}/cust-debit-notes/${id}/download-pdf`, {
      headers: {
        Authorization: req.headers.authorization || '',
        Accept: 'application/pdf',
      },
    })
    if (!response.ok) {
      const data = await response.json().catch(() => null)
      return res.status(response.status).json(data || { message: 'Failed to download debit note PDF' })
    }
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf')
    res.setHeader('Content-Disposition', response.headers.get('content-disposition') || `attachment; filename="${id}.pdf"`)
    return res.status(200).send(Buffer.from(await response.arrayBuffer()))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('download customer debit note PDF api error', error)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
