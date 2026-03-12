import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Credit note ID is required' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) {
    return res.status(500).json({ message: 'EPMS_API_BASE not configured' })
  }

  try {
    const url = `${base}/company-credit-notes/${id}/download-pdf`
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
        Accept: 'application/pdf',
      },
    })

    if (!resp.ok) {
      try {
        const errorBody = await resp.json()
        const message = errorBody?.message || `Failed to download company credit note PDF (status ${resp.status})`
        return res.status(resp.status).json({ message, details: errorBody })
      } catch {
        let text = ''
        try {
          text = await resp.text()
        } catch {
          // ignore
        }
        const message = text || `Failed to download company credit note PDF (status ${resp.status})`
        return res.status(resp.status).json({ message })
      }
    }

    const arrayBuffer = await resp.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const contentType = resp.headers.get('content-type') || 'application/pdf'
    const contentDisposition =
      resp.headers.get('content-disposition') || `attachment; filename="company-credit-note-${id}.pdf"`

    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', contentDisposition)

    return res.end(buffer)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('download company credit note pdf error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
