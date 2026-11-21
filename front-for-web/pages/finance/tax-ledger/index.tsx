import Link from "next/link";
import { useState } from "react";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import TaxLedgerTable from "../../../components/finance/TaxLedger/TaxLedgerTable";
import TaxBillsTable from "../../../components/finance/TaxLedger/TaxBillsTable";
import Can from "../../../components/auth/Can";

type TaxTab = "ledger" | "bills"

export default function TaxLedgerPage() {
  const [tab, setTab] = useState<TaxTab>("ledger")

  return (
    <AuthenticatedLayout>
      <Can
        any={["ROLE_VIEW_TRANSACTION"]}
        fallback={<div>You do not have permission to view the tax ledger.</div>}
      >
        <div className="mb-[25px] md:flex items-center justify-between">
          <div>
            <h5 className="!mb-1">Tax Bills &amp; Ledger</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly VAT bills and the ordered VAT ledger: VAT OUT (CR) declared on sales, VAT IN (DR) recoverable on purchases.
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
              <span className="pl-3">Tax Bills &amp; Ledger</span>
            </li>
          </ol>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-5 border-b border-gray-200 dark:border-[#172036]">
          {([
            { key: "ledger" as TaxTab, label: "Ledger" },
            { key: "bills" as TaxTab, label: "Tax Bills" },
          ]).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ${
                tab === item.key
                  ? "border-primary-500 text-primary-500 bg-primary-500/5"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-primary-500"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "ledger" ? <TaxLedgerTable /> : <TaxBillsTable />}
      </Can>
    </AuthenticatedLayout>
  );
}
