import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Starter</h5>

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
            Users
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Starter
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] py-[20px] md:py-[80px] px-[20px] md:px-[25px] rounded-md">
        <div className="trezo-card-content text-center">
          <Image
            src="/images/starter.png"
            className="inline-block"
            alt="starter-image"
            width={880}
            height={538}
          />

          <h4 className="md:!max-w-[550px] !mx-auto !leading-[1.5] !mt-[25px] md:!mt-[38px] !mb-[20px] md:!mb-[30px] !text-[19px] md:!text-[21px]">
            Create something beautiful, like a masterpiece or a really good
            sandwich.
          </h4>

          <Link
            href="/dashboard/ecommerce/"
            className="inline-block rounded-md transition-all font-medium md:text-md py-[12px] px-[25px] text-white bg-primary-500 hover:bg-primary-400"
          >
            Getting Started
          </Link>
        </div>
      </div>
    </>
  );
}
