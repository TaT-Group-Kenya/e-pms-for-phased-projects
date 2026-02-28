import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Invoice ID is required' })
    }

    const url = `${base}/company-invoices/${id}/download-pdf`
    const token = req.headers.authorization?.replace('Bearer ', '')

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!resp.ok) {
      const data = await resp.json().catch(() => null)
      return res.status(resp.status).json(data || { message: 'Failed to download invoice PDF' })
    }

    const buffer = Buffer.from(await resp.arrayBuffer())

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="company-invoice-${id}.pdf"`)

    return res.status(200).send(buffer)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('company-invoice download-pdf api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
