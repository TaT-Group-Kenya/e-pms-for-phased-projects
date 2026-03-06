import Link from "next/link";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import SetupListTable from "../../../components/setup/SetupListTable";
import Can from "../../../components/auth/Can";

const Page = () => {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_ACCOUNT_GROUP"]} fallback={<div>You do not have permission to view account groups.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
          <h5 className="!mb-0">Account Groups</h5>

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
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px]">Account Groups</li>
          </ol>
        </div>

        <SetupListTable
          title="Account Groups"
          entityName="Account Group"
          listEndpoint="/api/account-groups/list"
          createEndpoint="/api/account-groups/create"
          updateEndpoint="/api/account-groups/update"
          deleteEndpoint="/api/account-groups/delete"
          columns={[
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "description", label: "Description" },
          ]}
          searchableKeys={["name", "description"]}
        />
      </Can>
    </AuthenticatedLayout>
  );
};

export default Page;
