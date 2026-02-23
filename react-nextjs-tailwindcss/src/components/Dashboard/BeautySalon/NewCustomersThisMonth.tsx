"use client";

import React from "react";
import Image from "next/image";

const NewCustomersThisMonth: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <span className="block">New Customers This Month</span>
          <h2 className="!leading-none !text-2xl md:!text-3xl !mt-[6px] !mb-[8px]">
            14.5K
          </h2>
          <span className="inline-block text-xs rounded-[30px] px-[10px] border border-success-300 text-success-700 bg-success-100 dark:border-[#15203c] dark:bg-[#15203c]">
            +7%
          </span>

          <span className="block mt-[6px] text-xs">vs previous 30 days</span>

          <div className="flex items-center mt-[70px] mb-[5px]">
            <Image
              src="/images/users/user36.jpg"
              alt="user-image"
              className="rounded-full w-[46px] ltr:-mr-[20px] rtl:-ml-[20px] border-[2px] border-white dark:border-black shadow-lg"
              width={46}
              height={46}
            />
            <Image
              src="/images/users/user37.jpg"
              alt="user-image"
              className="rounded-full w-[46px] ltr:-mr-[20px] rtl:-ml-[20px] border-[2px] border-white dark:border-black shadow-lg"
              width={46}
              height={46}
            />
            <div className="flex items-center justify-center w-[46px] h-[46px] text-white bg-info-500 rounded-full shadow-lg font-bold ltr:-mr-[20px] rtl:-ml-[20px] border-[2px] border-white dark:border-black">
              P
            </div>
            <Image
              src="/images/users/user38.jpg"
              alt="user-image"
              className="rounded-full w-[46px] ltr:-mr-[20px] rtl:-ml-[20px] border-[2px] border-white dark:border-black shadow-lg"
              width={46}
              height={46}
            />
            <div className="flex items-center justify-center w-[46px] h-[46px] text-white bg-primary-500 rounded-full shadow-lg font-bold ltr:-mr-[20px] rtl:-ml-[20px] border-[2px] border-white dark:border-black">
              S
            </div>
            <Image
              src="/images/users/user43.jpg"
              alt="user-image"
              className="rounded-full w-[46px] ltr:-mr-[20px] rtl:-ml-[20px] border-[2px] border-white dark:border-black shadow-lg"
              width={46}
              height={46}
            />
            <div className="flex items-center justify-center w-[46px] h-[46px] text-white bg-black rounded-full shadow-lg font-bold ltr:-mr-[20px] rtl:-ml-[20px] border-[2px] border-white dark:border-black">
              +24
            </div>
          </div>

          <span className="block text-xs text-black dark:text-white font-medium">
            Joined Today
          </span>
        </div>
      </div>
    </>
  );
};

export default NewCustomersThisMonth;
