import Link from "next/link";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import SetupListTable from "../../../components/setup/SetupListTable";

const Page = () => {
  return (
    <AuthenticatedLayout>
      <>
        <div className="mb-[25px] md:flex items-center justify-between">
          <h5 className="!mb-0">Languages</h5>

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
            <li className="breadcrumb-item inline-block relative text-sm mx-[11px]">Languages</li>
          </ol>
        </div>

        <SetupListTable
          title="Languages"
          entityName="Language"
          listEndpoint="/api/languages/list"
          createEndpoint="/api/languages/create"
          updateEndpoint="/api/languages/update"
          deleteEndpoint="/api/languages/delete"
          columns={[
            { key: "id", label: "ID" },
            { key: "code", label: "Code" },
            { key: "name", label: "Name" },
            { key: "description", label: "Description" },
          ]}
          searchableKeys={["code", "name", "description"]}
        />
      </>
    </AuthenticatedLayout>
  );
};

export default Page;
