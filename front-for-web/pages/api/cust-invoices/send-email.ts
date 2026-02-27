import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const rawBodyId = (req.body as any)?.id
  const rawQueryId = req.query.id

  const id =
    (typeof rawBodyId === 'string' || typeof rawBodyId === 'number' ? String(rawBodyId) : undefined) ||
    (typeof rawQueryId === 'string' || typeof rawQueryId === 'number' ? String(rawQueryId) : undefined)

  if (!id) {
    return res.status(400).json({ message: 'Invoice ID is required' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) {
    return res.status(500).json({ message: 'EPMS_API_BASE not configured' })
  }

  try {
    const url = `${base}/cust-invoices/${id}/send-email`

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const data = await resp.json().catch(() => null)

    if (!resp.ok) {
      const message = data?.message || `Failed to send invoice email (status ${resp.status})`
      return res.status(resp.status).json({ message, details: data })
    }

    return res.status(200).json(data || { message: 'Invoice emailed to customer successfully.' })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('send invoice email error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
