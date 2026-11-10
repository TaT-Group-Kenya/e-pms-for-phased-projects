import Link from "next/link";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import TaxLedgerTable from "../../../components/finance/TaxLedger/TaxLedgerTable";
import Can from "../../../components/auth/Can";

export default function TaxLedgerPage() {
  return (
    <AuthenticatedLayout>
      <Can
        any={["ROLE_VIEW_TRANSACTION"]}
        fallback={<div>You do not have permission to view the tax ledger.</div>}
      >
        <div className="mb-[25px] md:flex items-center justify-between">
          <div>
            <h5 className="!mb-1">Tax Ledger</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tax postings on sales (collected, 2000) and costs (paid, 1000), with the net VAT position.
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
              <span className="pl-3">Tax Ledger</span>
            </li>
          </ol>
        </div>

        <TaxLedgerTable />
      </Can>
    </AuthenticatedLayout>
  );
}
