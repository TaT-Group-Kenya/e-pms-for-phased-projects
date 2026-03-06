import React from 'react'
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'
import CompanyCreditNotesTable from '../../../components/company/CompanyCreditNotesList/CompanyCreditNotesTable'
import Can from '../../../components/auth/Can'

const CompanyCreditNotesPage: React.FC = () => {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_COMPANY_CREDIT_NOTE"]} fallback={<div>You do not have permission to view company credit notes.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
        <div className="mb-[15px] md:mb-0">
          <h5 className="!mb-1">Company Credit Notes</h5>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage company credit notes, including drafts and raised refunds.
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-[10px] text-sm">
          <li>
            <span className="text-gray-500 dark:text-gray-400">Dashboard</span>
          </li>
          <li className="text-gray-400 dark:text-gray-500">/</li>
          <li className="text-primary-500 font-medium">Company Credit Notes</li>
        </ul>
        </div>

        <CompanyCreditNotesTable />
      </Can>
    </AuthenticatedLayout>
  )
}

export default CompanyCreditNotesPage
