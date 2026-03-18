// ...existing code...
import React from 'react';
import AuthenticatedLayout from '../../components/authenticated/AuthenticatedLayout';
import Can from '../../components/auth/Can';

export default function GeneralLedgerReportPage() {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_COMPANY_TRANSACTIONS_LEDGER", "ROLE_VIEW_CUSTOMER_TRANSACTIONS_LEDGER"]} fallback={<div>You do not have permission to view this report.</div>}>
        <div>General Ledger Report (scaffold)</div>
      </Can>
    </AuthenticatedLayout>
  );
}
