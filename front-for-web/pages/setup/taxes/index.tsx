import Link from "next/link";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import SetupListTable from "../../../components/setup/SetupListTable";
import Can from "../../../components/auth/Can";

const Page = () => {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_TAX"]} fallback={<div>You do not have permission to view taxes.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
          <h5 className="!mb-0">Taxes</h5>

          <ol className="breadcrumb mt-[12px] md:mt-0">
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px]">
              <Link
                href="/dashboard"
                className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
              >
                <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                  home
                </i>
                Dashboard
              </Link>
            </li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px]">System Setup</li>
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px]">Taxes</li>
          </ol>
        </div>

        <SetupListTable
          title="Taxes"
          entityName="Tax"
          listEndpoint="/api/taxes/list"
          createEndpoint="/api/taxes/create"
          updateEndpoint="/api/taxes/update"
          deleteEndpoint="/api/taxes/delete"
          columns={[
            { key: "id", label: "ID" },
            { key: "code", label: "Code" },
            { key: "name", label: "Name" },
            { key: "rate", label: "Rate" },
            { key: "is_default", label: "Default" },
            { key: "description", label: "Description" },
          ]}
          searchableKeys={["code", "name", "description"]}
        />
      </Can>
    </AuthenticatedLayout>
  );
};

export default Page;
