"use client";

import React from "react";
import Image from "next/image";

const AdSpend: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="flex items-center justify-between mb-[10px]">
            <div>
              <span className="block mb-[6px]">Ad Spend</span>
              <h3 className="!leading-none !text-xl md:!text-2xl lg:!text-3xl !mb-0">
                $1,528
              </h3>
            </div>
            <Image
              src="/images/icons/ads.gif"
              className="w-[60px] ltr:-mr-[10px] rtl:-ml-[10px]"
              alt="ads"
              width={60}
              height={60}
            />
          </div>
          <span className="inline-block text-xs px-[9px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] rounded-[100px]">
            +5.4%
          </span>
          <span className="block text-xs mt-[10px]">vs previous 30 days</span>
        </div>
      </div>
    </>
  );
};

export default AdSpend;
