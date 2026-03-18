// ...existing code...
import React from 'react';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import Can from '../../components/auth/Can';

export default function MarginPerProjectReportPage() {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_PROJECT", "ROLE_VIEW_COMPANY_PAYMENT", "ROLE_VIEW_CUST_PAYMENT"]} fallback={<div>You do not have permission to view this report.</div>}>
        <div>Margin Per Project Report (scaffold)</div>
      </Can>
    </AuthenticatedLayout>
  );
}
