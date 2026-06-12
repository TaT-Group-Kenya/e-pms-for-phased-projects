import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT' && req.method !== 'PATCH') return res.status(405).json({ message: 'Method not allowed' })
        console.log('Updating user with data:', {  ...req.body })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.query

    if (!id) return res.status(400).json({ message: 'User ID is required' })

    const url = new URL(`${base}/users/${id}`)

    const resp = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
      },
      body: JSON.stringify(req.body),
    })

    const data = await resp.json()
    if (!resp.ok) {
      return res.status(resp.status).json({ message: data.message })
    }
    return res.status(resp.status).json(data)
  } catch (err) {
    console.error('update user error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
