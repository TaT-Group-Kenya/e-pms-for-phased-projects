import type { NextApiRequest, NextApiResponse } from 'next';
import { JSON_HEADERS } from '../../../../constants/headers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;
  const base = process.env.EPMS_API_BASE;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid or missing id' });
  }
  if (!base) {
    return res.status(500).json({ message: 'API base URL not configured.' });
  }

  const url = `${base}/payment-receiving-methods/${id}`;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (method === 'PUT') {
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const apiRes = await fetch(url, {
        method: 'PUT',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(req.body),
      });
      const data = await apiRes.json();
      res.status(apiRes.status).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update payment receiving method' });
    }
  } else if (method === 'DELETE') {
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const apiRes = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await apiRes.json();
      res.status(apiRes.status).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete payment receiving method' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
