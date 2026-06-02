import type { NextApiRequest, NextApiResponse } from 'next'

// Disable the default body parser so we can stream
// multipart/form-data as well as JSON bodies for updates.
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['GET', 'PUT', 'DELETE'].includes(req.method || '')) {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Document ID is required' })
    }

    const url = `${base}/company-invoice-documents/${id}`
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (req.method === 'GET') {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      })

      const data = await resp.json().catch(() => null)

      if (!resp.ok) {
        return res.status(resp.status).json(data?.errors || data || { message: 'Failed to load document' })
      }

      return res.status(resp.status).json(data)
    }

    if (req.method === 'PUT') {
      // Stream the incoming body (JSON or multipart) directly to Laravel
      const contentType = req.headers['content-type']
      const authorization = req.headers['authorization']

      const headers: Record<string, string> = {}
      if (typeof contentType === 'string') headers['Content-Type'] = contentType
      if (typeof authorization === 'string') headers['Authorization'] = authorization

      const resp = await fetch(url, {
        method: 'PUT',
        body: req as any,
        headers,
        duplex: 'half',
      } as any)

      const data = await resp.json().catch(() => null)

      if (!resp.ok) {
        return res.status(resp.status).json(data?.errors || data || { message: 'Failed to update document' })
      }

      return res.status(resp.status).json(data)
    }

    if (req.method === 'DELETE') {
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      })

      if (resp.status === 204) {
        return res.status(204).end()
      }

      const data = await resp.json().catch(() => null)

      if (!resp.ok) {
        return res.status(resp.status).json(data || { message: 'Failed to delete document' })
      }

      return res.status(resp.status).json(data || { message: 'Document deleted successfully' })
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('company-invoice-documents id api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
