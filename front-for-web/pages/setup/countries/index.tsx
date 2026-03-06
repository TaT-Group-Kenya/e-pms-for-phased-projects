import Link from "next/link";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import SetupListTable from "../../../components/setup/SetupListTable";
import Can from "../../../components/auth/Can";

const Page = () => {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_COUNTRY"]} fallback={<div>You do not have permission to view countries.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
          <h5 className="!mb-0">Countries</h5>

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
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px]">Countries</li>
          </ol>
        </div>

        <SetupListTable
          title="Countries"
          entityName="Country"
          listEndpoint="/api/countries/paged-list"
          createEndpoint="/api/countries/create"
          updateEndpoint="/api/countries/update"
          deleteEndpoint="/api/countries/delete"
          columns={[
            { key: "id", label: "ID" },
            { key: "code", label: "Code" },
            { key: "dial_code", label: "Dial Code" },
            { key: "name", label: "Name" },
          ]}
          searchableKeys={["code", "dial_code", "name"]}
          canCreateRoles={["ROLE_ADD_COUNTRY"]}
          canEditRoles={["ROLE_EDIT_COUNTRY"]}
          canDeleteRoles={["ROLE_DELETE_COUNTRY"]}
        />
      </Can>
    </AuthenticatedLayout>
  );
};

export default Page;
