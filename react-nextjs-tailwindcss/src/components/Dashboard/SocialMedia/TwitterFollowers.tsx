"use client";

import React from "react";
import Image from "next/image"; 

const TwitterFollowers: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <Image src="/images/icons/x.svg" alt="x" width={40} height={40} />

          <h3 className="!font-medium !text-2xl md:!text-3xl lg:!text-4xl !-tracking-[1px] !mt-[16px] !-mb-[2px]">
            75.2k
          </h3>

          <span className="block">Followers</span>

          <div className="flex items-center gap-[5px] mt-[15px] md:mt-[20px]">
            <span className="block text-xs">This Month</span>

            <span className="inline-block text-xs rounded-[4px] bg-success-100 dark:bg-[#15203c] text-success-700 ltr:pl-[19px] rtl:pr-[19px] ltr:pr-[5px] rtl:pl-[5px] relative">
              <i className="ri-arrow-up-line absolute ltr:left-[5px] rtl:right-[5px] top-1/2 -translate-y-1/2"></i>
              3.5%
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TwitterFollowers;
