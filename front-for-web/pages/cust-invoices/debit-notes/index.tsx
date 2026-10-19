import React from 'react'
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'
import CustDebitNotesTable from '../../../components/customer/CustDebitNotesList/CustDebitNotesTable'
import Can from '../../../components/auth/Can'

const CustDebitNotesPage: React.FC = () => {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_CUST_DEBIT_NOTE"]} fallback={<div>You do not have permission to view customer debit notes.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-1">Customer Debit Notes</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review and manage all customer debit notes.
            </p>
          </div>
        </div>

        <CustDebitNotesTable />
      </Can>
    </AuthenticatedLayout>
  )
}

export default CustDebitNotesPage
