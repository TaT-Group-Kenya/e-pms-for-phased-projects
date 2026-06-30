import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Company ID is required' })
    }

    const url = `${base}/companies/${id}`

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
      },
    })

    if (resp.status === 204) {
      return res.status(200).json({ message: 'Company deleted successfully' });
    }

    const data = await resp.json().catch(() => null)
    
    if (!resp.ok) {
      return res.status(resp.status).json({message: data ? data.message: 'Failed to delete. Error: ' + resp.status})
    }

    return res.status(resp.status).json({ message: "Deleted!" })
  } catch (err) {
    console.error('delete company error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
