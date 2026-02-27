import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Quotation ID is required' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) {
    return res.status(500).json({ message: 'EPMS_API_BASE not configured' })
  }

  try {
    const url = `${base}/quotations/${id}/download-pdf`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
        Accept: 'application/pdf',
      },
    })

    if (!resp.ok) {
      // Try to read a JSON error body first
      try {
        const errorBody = await resp.json()
        const message = errorBody?.message || `Failed to download quotation PDF (status ${resp.status})`
        return res.status(resp.status).json({ message, details: errorBody })
      } catch {
        // If the backend didn't return JSON (e.g. HTML error page), fall back to text
        let text = ''
        try {
          text = await resp.text()
        } catch {
          // ignore
        }
        const message = text || `Failed to download quotation PDF (status ${resp.status})`
        return res.status(resp.status).json({ message })
      }
    }

    const arrayBuffer = await resp.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const contentType = resp.headers.get('content-type') || 'application/pdf'
    const contentDisposition =
      resp.headers.get('content-disposition') || `attachment; filename="quotation-${id}.pdf"`

    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', contentDisposition)

    return res.end(buffer)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('download quotation pdf error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
