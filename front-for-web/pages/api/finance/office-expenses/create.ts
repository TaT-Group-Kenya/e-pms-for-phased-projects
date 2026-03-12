// API proxy for creating an office expense
import type { NextApiRequest, NextApiResponse } from 'next';
import { JSON_HEADERS } from '../../../../constants/headers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Only use bearer token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const base = process.env.EPMS_API_BASE
  if (!base) {
    return res.status(500).json({ message: 'API base URL not configured.' });
  }

  try {
    const apiRes = await fetch(`${base}/office-expenses`, {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req.body),
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create office expense.', error: String(err), base });
  }
}
