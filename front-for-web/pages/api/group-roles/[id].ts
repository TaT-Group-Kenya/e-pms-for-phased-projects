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
      return res.status(400).json({ message: 'GroupRole ID is required' })
    }

    const url = `${base}/group-roles/${id}`
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (req.method === 'GET') {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await resp.json()
      return res.status(resp.status).json(data)
    }

    if (req.method === 'PUT') {
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
        body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
      })

      const data = await resp.json()
      return res.status(resp.status).json(data)
    }

    // DELETE
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!resp.ok) {
      const data = await resp.json().catch(() => ({ message: 'Failed to delete group-role' }))
      return res.status(resp.status).json(data)
    }

    return res.status(resp.status).json({ message: 'GroupRole deleted successfully' })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('group-role api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
