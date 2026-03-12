import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../../constants/headers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  if (req.method === 'POST') {
    try {
      const url = `${base}/office-expenses`;
      const token = req.headers.authorization?.replace('Bearer ', '');
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(req.body),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return res.status(resp.status).json(data.errors || data);
      }
      return res.status(resp.status).json(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('office-expense create api error', err);
      return res.status(500).json({ message: 'Proxy error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
