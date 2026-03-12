import type { NextApiRequest, NextApiResponse } from 'next';
import { JSON_HEADERS } from '../../../constants/headers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE;
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' });

  const id = req.query.id;
  let url = `${base}/office-expense-categories`;
  if (id) url += `/${id}`;

  try {
    if (req.method === 'GET') {
      // List or get single
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
        },
      });
      const data = await resp.json();
      return res.status(resp.status).json(data);
    }
    if (req.method === 'POST') {
      // Create
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
        },
        body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
      });
      const data = await resp.json();
      return res.status(resp.status).json(data);
    }
    if (req.method === 'PUT') {
      // Update
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
        },
        body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
      });
      const data = await resp.json();
      return res.status(resp.status).json(data);
    }
    if (req.method === 'DELETE') {
      // Delete
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
        },
      });
      const data = await resp.json();
      return res.status(resp.status).json(data);
    }
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('office-expense-categories api error', err);
    return res.status(500).json({ message: 'Proxy error' });
  }
}
