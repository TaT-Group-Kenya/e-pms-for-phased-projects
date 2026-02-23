import AdditionalInformation from "@/components/MyProfile/AdditionalInformation";
import ProfileInformation from "@/components/MyProfile/ProfileInformation";
import ProfileIntro from "@/components/MyProfile/ProfileIntro";
import ProjectsAnalysis from "@/components/MyProfile/ProjectsAnalysis";
import RecentActivity from "@/components/MyProfile/RecentActivity";
import ToDoList from "@/components/MyProfile/ToDoList";
import TotalCourses from "@/components/MyProfile/TotalCourses";
import TotalEnrolled from "@/components/MyProfile/TotalEnrolled";
import TotalMentors from "@/components/MyProfile/TotalMentors";
import Welcome from "@/components/MyProfile/Welcome";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">My Profile</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
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

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            My Profile
          </li>
        </ol>
      </div>

      <div className="2xl:grid 2xl:grid-cols-2 gap-[25px]">
        <div>
          <Welcome />
        </div>

        <div>
          <div className="sm:grid sm:grid-cols-3 gap-[25px]">
            <div>
              <TotalCourses />
            </div>

            <div>
              <TotalEnrolled />
            </div>

            <div>
              <TotalMentors />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 2xl:grid-cols-4 gap-[25px]">
        <div className="lg:col-span-1">
          <ProfileIntro />

          <ProfileInformation />

          <AdditionalInformation />
        </div>

        <div className="lg:col-span-2 2xl:col-span-3">
          <ProjectsAnalysis />

          <ToDoList />

          <RecentActivity />
        </div>
      </div>
    </>
  );
}
