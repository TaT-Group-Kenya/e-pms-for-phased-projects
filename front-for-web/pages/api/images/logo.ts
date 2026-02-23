import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { filename } = req.query

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ message: 'Filename is required' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) {
    return res.status(500).json({ message: 'EPMS_API_BASE not configured' })
  }

  try {
    const url = `${base}/images/logos/${filename}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
        Accept: 'image/*',
      },
    })

    if (!resp.ok) {
      return res.status(resp.status).json({ message: 'Image not found' })
    }

    const buffer = await resp.arrayBuffer()
    const contentType = resp.headers.get('content-type') || 'application/octet-stream'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    return res.end(Buffer.from(buffer))
  } catch (err) {
    console.error('Error fetching logo:', err)
    return res.status(500).json({ message: 'Failed to fetch logo' })
  }
}
