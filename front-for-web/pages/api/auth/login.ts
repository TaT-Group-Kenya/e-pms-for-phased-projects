import type { NextApiRequest, NextApiResponse } from 'next'

import { JSON_HEADERS } from '../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

    console.log("base url ", base);

  try {
    const resp = await fetch(`${base}/login`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(req.body),
    })

    const data = await resp.json()
    return res.status(resp.status).json(data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('auth proxy error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
