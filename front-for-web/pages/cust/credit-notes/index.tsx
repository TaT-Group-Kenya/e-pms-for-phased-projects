import React from 'react'
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'
import CustCreditNotesTable from '../../../components/customer/CustCreditNotesList/CustCreditNotesTable'

const CustCreditNotesPage: React.FC = () => {
  return (
    <AuthenticatedLayout>
      <div className="mb-[25px] md:flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-1">Customer Credit Notes</h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review and manage all customer credit notes.
          </p>
        </div>
      </div>

      <CustCreditNotesTable />
    </AuthenticatedLayout>
  )
}

export default CustCreditNotesPage
