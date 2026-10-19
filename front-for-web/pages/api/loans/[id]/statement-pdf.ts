import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ message: 'Loan ID is required' })

    const url = `${base}/loans/${id}/statement-pdf`
    const token = req.headers.authorization?.replace('Bearer ', '')

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!resp.ok) {
      const data = await resp.json().catch(() => null)
      const message = typeof data === 'string' ? data : data?.message || 'Failed to generate loan statement PDF'
      return res.status(resp.status).json({ message })
    }

    const buffer = Buffer.from(await resp.arrayBuffer())
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', resp.headers.get('content-disposition') || 'attachment')
    return res.status(200).send(buffer)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('loan statement pdf proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}