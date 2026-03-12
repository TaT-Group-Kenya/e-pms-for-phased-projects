import type { NextApiRequest, NextApiResponse } from 'next';
import { JSON_HEADERS } from '../../../../constants/headers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE;
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' });

  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ message: 'Invalid category id' });
  const url = `${base}/office-expense-categories/${id}`;

  try {
    if (req.method === 'GET') {
      // Get single
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
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
