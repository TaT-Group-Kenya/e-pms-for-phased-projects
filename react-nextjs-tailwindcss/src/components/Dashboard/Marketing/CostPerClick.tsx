"use client";

import React from "react";
import Image from "next/image";

const CostPerClick: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="flex items-center justify-between mb-[10px]">
            <div>
              <span className="block mb-[6px]">Cost Per Thousand</span>
              <h3 className="!leading-none !text-xl md:!text-2xl lg:!text-3xl !mb-0">
                $3.95
              </h3>
            </div>
            <Image
              src="/images/icons/video-advertising.gif"
              className="w-[60px] ltr:-mr-[10px] rtl:-ml-[10px]"
              alt="video-advertising"
              width={60}
              height={60}
            />
          </div>
          <span className="inline-block text-xs px-[9px] text-orange-700 border border-orange-300 bg-orange-100 dark:bg-[#15203c] dark:border-[#172036] rounded-[100px]">
            -1.4%
          </span>
          <span className="block text-xs mt-[10px]">vs previous 30 days</span>
        </div>
      </div>
    </>
  );
};

export default CostPerClick;
