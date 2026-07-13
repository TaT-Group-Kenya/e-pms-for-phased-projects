import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['GET', 'PUT', 'DELETE'].includes(req.method || '')) {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Project Owner ID is required' })
    }

    const url = `${base}/project-owners/${id}`
    const token = req.headers.authorization?.replace('Bearer ', '')

    // Handle GET request
    if (req.method === 'GET') {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await resp.json()

      if (!resp.ok) {
        return res.status(resp.status).json(data.errors || data)
      }

      return res.status(resp.status).json(data)
    }

    // Handle PUT request (Update)
    if (req.method === 'PUT') {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        ...JSON_HEADERS,
      }

      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)

      const resp = await fetch(url, {
        method: 'PUT',
        headers,
        body,
      })

      const data = await resp.json()

      if (!resp.ok) {
        return res.status(resp.status).json(data.errors || data)
      }

      return res.status(resp.status).json(data)
    }

    // Handle DELETE request
    if (req.method === 'DELETE') {
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      })

      if (!resp.ok) {
        const data = await resp.json()
        return res.status(resp.status).json(data.errors || data || { message: 'Failed to delete project owner' })
      }

      return res.status(resp.status).json({ message: 'Project Owner deleted successfully' })
    }
  } catch (err) {
    console.error('project owner api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
