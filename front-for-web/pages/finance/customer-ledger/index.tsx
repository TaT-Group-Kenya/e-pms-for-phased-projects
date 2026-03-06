import Link from "next/link";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import CustomerLedgerTable from "../../../components/finance/Ledger/CustomerLedgerTable";
import Can from "../../../components/auth/Can";

export default function CustomerLedgerPage() {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_CUSTOMER_TRANSACTIONS_LEDGER"]} fallback={<div>You do not have permission to view the customer ledger.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
          <div>
            <h5 className="!mb-1">Customer Ledger</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Read-only view of customer-side ledger entries.
            </p>
          </div>

          <ol className="breadcrumb mt-[12px] md:mt-0">
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              <Link
                href="/dashboard/ecommerce/"
                className="inline-block relative ltr:pl-[22px] rtl:pr[22px] transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                  home
                </i>
                Dashboard
              </Link>
            </li>

            <li className="breadcrumb-item inline-block relative text-sm mx-[11px]">Finance</li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px]">
              Customer Ledger
            </li>
          </ol>
        </div>

        <CustomerLedgerTable />
      </Can>
    </AuthenticatedLayout>
  );
}
