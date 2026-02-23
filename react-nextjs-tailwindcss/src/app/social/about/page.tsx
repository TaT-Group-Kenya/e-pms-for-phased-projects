import AboutMe from "@/components/Social/AboutMe";
import CoverPhoto from "@/components/Social/CoverPhoto";
import Followers from "@/components/Social/Followers";
import Following from "@/components/Social/Following";
import Friends from "@/components/Social/Friends";
import Nav from "@/components/Social/Nav";
import Photos from "@/components/Social/Photos"; 
import ProfileIntro from "@/components/Social/ProfileIntro";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Profile</h5>

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
            Social
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Profile
          </li>
        </ol>
      </div>

      <div className="lg:grid 2xl:grid-cols-4 gap-[25px]">
        <div className="2xl:col-span-3">
          <CoverPhoto />

          <Nav />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Friends />
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <AboutMe />
            </div>
          </div>
        </div>

        <div className="2xl:col-span-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
            <div className="2xl:col-span-2">
              <ProfileIntro />
            </div>

            <div className="2xl:col-span-2">
              <Followers />
            </div>

            <div className="2xl:col-span-2">
              <Following />
            </div>

            <div className="2xl:col-span-2">
              <Photos />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
