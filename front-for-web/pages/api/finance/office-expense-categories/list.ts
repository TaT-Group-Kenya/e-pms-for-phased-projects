import type { NextApiRequest, NextApiResponse } from 'next';
import { JSON_HEADERS } from '../../../../constants/headers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE;
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' });

  const token = req.headers.authorization?.replace('Bearer ', '');
  const url = `${base}/office-expense-categories`;

  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await resp.json();
    return res.status(resp.status).json(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('office-expense-categories list api error', err);
    return res.status(500).json({ message: 'Proxy error' });
  }
}
