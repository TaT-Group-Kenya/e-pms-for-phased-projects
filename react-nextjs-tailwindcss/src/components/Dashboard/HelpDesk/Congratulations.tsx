"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Congratulations: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content relative">
          <h5 className="!font-semibold !mb-[2px]">
            Congratulations, <span className="text-primary-500">Olivia!</span>
          </h5>

          <p className="mb-[14px]">Best agent of the month</p>

          <h6 className="!text-secondary-500 !text-[20px] !mb-[1px]">1.5k+</h6>

          <span className="block">Ticket Solved</span>

          <Link
            href="/my-profile/"
            className="inline-block font-medium rounded-md text-primary-50 bg-primary-500 mt-[16px] px-[9.3px] py-[3.5px] transition-all hover:bg-primary-400"
          >
            View Profile
          </Link>

          <Image
            src="/images/trophy.gif"
            className="absolute bottom-0 ltr:right-0 rtl:left-0 max-w-[130px] md:max-w-[152px]"
            alt="trophy-image"
            width={305}
            height={314}
          />
        </div>
      </div>
    </>
  );
};

export default Congratulations;
