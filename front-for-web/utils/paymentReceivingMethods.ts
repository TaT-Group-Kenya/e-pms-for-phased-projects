// Utility to fetch active payment receiving methods from the backend
export async function fetchActivePaymentReceivingMethods(accessToken: string) {
  const resp = await fetch('/api/finance/payment-receiving-methods/list?status=active&is_deleted=0', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!resp.ok) {
    throw new Error('Failed to fetch payment receiving methods');
  }
  const data = await resp.json().catch(() => null);
  return (data?.data || data) as Array<{
    id: number;
    name: string;
    status: string;
    is_deleted: number;
  }>;
}
