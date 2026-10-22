import Link from 'next/link'
import AuthenticatedLayout from '../../../components/authenticated/AuthenticatedLayout'
import React from 'react'
import Can from '../../../components/auth/Can'
import { useSelector } from 'react-redux'
import { selectAccessToken } from '../../../store/auth/selectors'
import { useToast } from '../../../hooks/useToast'
import { useListQuery } from '../../../hooks/useListQuery'
import PaginationFooter from '../../../components/common/PaginationFooter'
import { formatDate } from '../../../utils/format'

export default function PdcIssuedListPage() {
  const accessToken = useSelector(selectAccessToken)
  const { addToast, removeToast } = useToast()

  // Server-side listing: pagination, debounced search and status filter all
  // live in useListQuery; the page renders the rows it gets back.
  const {
    searchInput,
    setSearchInput,
    filters,
    setFilter,
    clearFilters,
    page,
    setPage,
    perPage,
    changePerPage,
    rows: items,
    loading,
    error,
    meta,
  } = useListQuery<any>('/api/pdc-issued/list', {
    accessToken,
    initialFilters: { status: 'all' },
    onError: (message) => addToast(message, 'error'),
  })

  const statusFilter = filters.status || 'all'
  const hasExtraFilters = !!searchInput || statusFilter !== 'all'
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_PDC_ISSUED_COMPANY"]} fallback={<div>You do not have permission to view PDC issued.</div>}>
        <div className="trezo-card-header bg-white mb-[20px] md:mb-[25px] flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-md gap-[15px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">PDC Issued (Service Provider)</h5>
          </div>
          <div className="flex flex-col gap-[12px] w-1/2 md:flex-row md:flex-wrap md:items-center md:justify-end">
            <div className="relative flex-1 md:flex-none md:w-[200px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </label>
              <input
                type="text"
                placeholder="Search PDCs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full block text-black dark:text-white pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
              />
            </div>
            {/* <input
            type="text"
            placeholder="Filter by company..."
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full md:w-[200px] block text-black dark:text-white px-[13px] placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-0"
          /> */}
            <select
              value={statusFilter}
              onChange={(e) => setFilter('status', e.target.value)}
              className="bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] h-[36px] text-xs rounded-md w-full md:w-[200px] block text-black dark:text-white px-[13px] outline-0"
            >
              <option value="all">All Status</option>
              <option value="issued">Issued</option>
              <option value="received">Received</option>
              <option value="pending">Pending</option>
              <option value="cleared">Cleared</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
          {loading ? (
            <div className="p-[20px] md:p-[25px]">
              <div className="space-y-[10px]">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-[60px] bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive overflow-x-auto">
                <table className="w-full">
                  <thead className="text-black dark:text-white">
                    <tr>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Title</th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Service Provider</th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Cheque No</th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Cheque Date</th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Amount</th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Due in days</th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Status</th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[15px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-black dark:text-white">
                    {(items || []).filter((it) => {

                    }).map((it: any) => {
                      const parseDate = (d: any) => {
                        try {
                          const dt = new Date(d)
                          if (isNaN(dt.getTime())) return null
                          return dt
                        } catch {
                          return null
                        }
                      }

                      const chequeDate = parseDate(it.cheque_date)
                      let dueInDays: number | string = '-'
                      if (chequeDate) {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        chequeDate.setHours(0, 0, 0, 0)
                        dueInDays = Math.round((chequeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                      }

                      return (
                      <tr key={it.id} className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors">
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <Link href={`/company/pdc-issued/${it.id}`} className="text-primary-500 hover:text-primary-600 hover:underline font-medium text-sm">PDC for invoice {it.invoice_number}</Link>
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{it.company_name || it.company?.name || '-'}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{it.cheque_number || '-'}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{formatDate(it.cheque_date) || '-'}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{it.amount || '-'}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          {Number(dueInDays) > 0 ? (
                            <span className="inline-block px-[10px] py-[5px] rounded-full text-xs font-medium bg-info-50 text-info-500">{dueInDays} days</span>
                          ) : (
                            <span className="inline-block px-[10px] py-[5px] rounded-full text-xs font-medium bg-danger-50 text-danger-500">past</span>
                          )}
                        </td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">{it.status || '-'}</td>
                        <td className="ltr:text-left rtl:text-right px-[20px] py-[15px] whitespace-nowrap">
                          <div className="flex items-center gap-[10px]">
                            <Link href={`/company/pdc-issued/${it.id}`} className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all" title="View Details">
                              <i className="material-symbols-outlined !text-[18px]">visibility</i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
                {(!loading && !error) && (
                  <PaginationFooter
                    meta={meta}
                    page={page}
                    perPage={perPage}
                    loading={loading}
                    onPageChange={setPage}
                    onPerPageChange={changePerPage}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </Can>
    </AuthenticatedLayout>
  )
}
