"use client";

import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content md:pb-[75px] text-center">
          <Image
            src="/images/internal-error.png"
            className="inline-block"
            alt="internal-error-image"
            width={400}
            height={434}
          />
          <h4 className="!text-[19px] md:!text-[21px] !mt-[25px] md:!mt-[33px] !mb-[11px]">
            Looks like we have an internal error, please try again later.
          </h4>
          <p>
            But no worries! Our team is looking ever where while you wait
            safely.
          </p>
          <Link
            href="/dashboard/ecommerce/"
            className="inline-block font-medium rounded-md md:text-md mt-[2px] md:mt-[12px] py-[12px] px-[25px] text-white bg-primary-500 transition-all hover:bg-primary-400"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
