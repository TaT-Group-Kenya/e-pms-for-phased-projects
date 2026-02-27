import { useRouter } from "next/router";
import Link from "next/link";
import ProjectOverviewContent from "../../../components/project/ProjectOverviewContent";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return (
      <AuthenticatedLayout>
        <div className="text-center py-[40px]">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <>
        <div className="mb-[25px] md:flex items-center justify-between">
          <h5 className="!mb-0">Project Details</h5>

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
              <Link
                href="/project/project-list"
                className="inline-block relative transition-all hover:text-primary-500"
              >
                Projects
              </Link>
            </li>

            <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
              Details
            </li>
          </ol>
        </div>

        <ProjectOverviewContent projectId={String(id)} />
      </>
    </AuthenticatedLayout>
  );
}
