import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, paymentId } = req.body || {};

  if (!id || !paymentId) {
    return res.status(400).json({ message: 'Missing id or paymentId' });
  }

  try {
    const baseUrl = process.env.EPMS_API_BASE as string;

    const url = `${baseUrl}/company-invoices/${id}/payments/${paymentId}`;

    const backendResponse = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
    });

    const data = await backendResponse.json().catch(() => null);

    return res.status(backendResponse.status).json(data ?? {});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error proxying company invoice delete-payment:', error);
    return res.status(500).json({ message: 'Failed to delete company invoice payment.' });
  }
}
