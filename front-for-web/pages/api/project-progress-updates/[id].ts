import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' })
  }

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
      Accept: 'application/json',
    }

    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type']
    }

    const url = `${base}/project-progress-updates/${id}`

    // Handle PUT requests for updating
    if (req.method === 'PUT') {
      const resp = await fetch(url, {
        method: 'PUT',
        headers,
        body: req as any,
        duplex: 'half',
      } as any)

      const contentType = resp.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await resp.text()
        console.error('Non-JSON response from backend:', text.substring(0, 200))
        return res.status(500).json({ message: 'Invalid response from server' })
      }

      const data = await resp.json()

      if (!resp.ok) {
        return res.status(resp.status).json(data.errors || data)
      }

      return res.status(resp.status).json(data)
    }

    // Handle GET requests for retrieving single update
    if (req.method === 'GET') {
      const resp = await fetch(url, {
        method: 'GET',
        headers,
      })

      const contentType = resp.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await resp.text()
        console.error('Non-JSON response from backend:', text.substring(0, 200))
        return res.status(500).json({ message: 'Invalid response from server' })
      }

      const data = await resp.json()

      if (!resp.ok) {
        return res.status(resp.status).json(data.errors || data)
      }

      return res.status(resp.status).json(data)
    }

    // Handle DELETE requests
    if (req.method === 'DELETE') {
      const resp = await fetch(url, {
        method: 'DELETE',
        headers,
      })

      if (resp.status === 204) {
        return res.status(204).end()
      }

      const contentType = resp.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await resp.text()
        console.error('Non-JSON response from backend:', text.substring(0, 200))
        return res.status(500).json({ message: 'Invalid response from server' })
      }

      const data = await resp.json()

      if (!resp.ok) {
        return res.status(resp.status).json(data.errors || data)
      }

      return res.status(resp.status).json(data)
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (err) {
    console.error('project progress update error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
