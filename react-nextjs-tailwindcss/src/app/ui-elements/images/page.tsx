import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Images</h5>

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
            UI Elements
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Images
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Responsive Images</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <Image
            src="/images/profile-cover.jpg"
            className="inline-block w-full"
            alt="img-fluid"
            width={1540}
            height={330}
          />
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Aligning Images</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <Image
            src="/images/200.jpg"
            className="rounded-md inline-block"
            alt="image"
            width={200}
            height={200}
          />
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="text-center">
            <Image
              src="/images/200.jpg"
              className="rounded-md inline-block"
              alt="image"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="ltr:text-right rtl:text-left">
            <Image
              src="/images/200.jpg"
              className="rounded-md inline-block"
              alt="image"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Picture</h5>
            </div>
          </div>
          <div className="trezo-card-content">
            <Image
              src="/images/courses/course3.jpg"
              className="img-fluid"
              alt="image"
              width={520}
              height={520}
            />
          </div>
        </div>

        <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
            <div className="trezo-card-title">
              <h5 className="!mb-0">Image Thumbnails</h5>
            </div>
          </div>
          <div className="trezo-card-content">
            <Image
              src="/images/200.jpg"
              className="inline-block p-[.25rem] border border-gray-100 rounded-md dark:border-[#172036]"
              alt="img-thumbnail"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </>
  );
}
