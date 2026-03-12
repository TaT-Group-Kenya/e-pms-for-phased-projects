import React from 'react'
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'
import CustCreditNotesTable from '../../../components/customer/CustCreditNotesList/CustCreditNotesTable'
import Can from '../../../components/auth/Can'

const CustCreditNotesPage: React.FC = () => {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_CUST_CREDIT_NOTE"]} fallback={<div>You do not have permission to view customer credit notes.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-1">Customer Credit Notes</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review and manage all customer credit notes.
            </p>
          </div>
        </div>

        <CustCreditNotesTable />
      </Can>
    </AuthenticatedLayout>
  )
}

export default CustCreditNotesPage
