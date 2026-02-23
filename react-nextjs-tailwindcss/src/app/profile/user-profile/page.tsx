import CoverPhoto from "@/components/Profile/CoverPhoto";
import Nav from "@/components/Profile/Nav";
import AboutMe from "@/components/Profile/UserProfile/AboutMe";
import Followers from "@/components/Profile/UserProfile/Followers";
import MyProjects from "@/components/Profile/UserProfile/MyProjects";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">User Profile</h5>

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
            Profile
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            User Profile
          </li>
        </ol>
      </div>

      <CoverPhoto />

      <Nav />

      <div className="lg:grid lg:grid-cols-3 gap-[25px]">
        <div className="lg:col-span-2">
          <AboutMe />
        </div>

        <div className="lg:col-span-1">
          <Followers />
        </div>
      </div>

      <MyProjects />
    </>
  );
}
