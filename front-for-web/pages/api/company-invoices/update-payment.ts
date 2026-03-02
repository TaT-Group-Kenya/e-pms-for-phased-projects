import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, paymentId, ...payload } = req.body || {};

  if (!id || !paymentId) {
    return res.status(400).json({ message: 'Missing id or paymentId' });
  }

  try {
    const baseUrl = process.env.EPMS_API_BASE as string;

    const url = `${baseUrl}/company-invoices/${id}/payments/${paymentId}`;

    const backendResponse = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await backendResponse.json().catch(() => null);

    return res.status(backendResponse.status).json(data ?? {});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error proxying company invoice update-payment:', error);
    return res.status(500).json({ message: 'Failed to update company invoice payment.' });
  }
}
