import Link from "next/link";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import LendersTable from "../../../components/finance/Lenders/LendersTable";
import Can from "../../../components/auth/Can";

export default function LendersPage() {
  return (
    <AuthenticatedLayout>
      <Can
        any={["ROLE_VIEW_LOAN"]}
        fallback={<div>You do not have permission to view lenders.</div>}
      >
        <div className="mb-[25px] md:flex items-center justify-between">
          <div>
            <h5 className="!mb-1">Lenders</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Persons or corporates you borrow from — selected when onboarding a loan.
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
              Lenders
            </li>
          </ol>
        </div>

        <LendersTable />
      </Can>
    </AuthenticatedLayout>
  );
}
