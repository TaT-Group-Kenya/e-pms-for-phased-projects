import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionToken } from '../../../utils/apiProxyAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const base = process.env.EPMS_API_BASE;
  if (!base) return res.status(500).json({ error: 'EPMS_API_BASE not configured' });
  const apiRes = await fetch(`${base}/external-customer/quotations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await apiRes.json();
  res.status(apiRes.status).json(data);
}
