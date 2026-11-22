import Link from "next/link";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import AccountingPeriodsTable from "../../../components/finance/AccountingPeriods/AccountingPeriodsTable";
import Can from "../../../components/auth/Can";

export default function AccountingPeriodsPage() {
  return (
    <AuthenticatedLayout>
      <Can
        any={["ROLE_VIEW_ACCOUNTING_PERIOD"]}
        fallback={<div>You do not have permission to view accounting periods.</div>}
      >
        <div className="mb-[25px] md:flex items-center justify-between">
          <div>
            <h5 className="!mb-1">Accounting Periods</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Close and reopen months to lock financial postings.
            </p>
          </div>

          <ol className="breadcrumb items-center inline-flex flex-wrap mt-[12px] md:mt-0">
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 py-[4px]">
              <Link
                href="/dashboard/ecommerce/"
                className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                  home
                </i>
                Dashboard
              </Link>
            </li>

            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] py-[4px]">
              Finance
            </li>

            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:last:ml-0 rtl:last:mr-0 py-[4px] text-black dark:text-white">
              <span className="pl-3">Accounting Periods</span>
            </li>
          </ol>
        </div>

        <AccountingPeriodsTable />
      </Can>
    </AuthenticatedLayout>
  );
}
