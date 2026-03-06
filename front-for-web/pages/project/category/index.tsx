import Link from "next/link";
import CategoryList from "../../../components/project/CategoryList/CategoryList";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import Can from "../../../components/auth/Can";

export default function Page() {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_PROJECT_CATEGORY"]} fallback={<div>You do not have permission to view project categories.</div>}>
        <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Project Categories</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
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

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Projects
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Categories
          </li>
        </ol>
        </div>

        <CategoryList />
      </Can>
    </AuthenticatedLayout>
  );
}
