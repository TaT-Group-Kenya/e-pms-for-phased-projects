"use client";

import React from "react";
import Image from "next/image";

const DailyLimit: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[10px] rounded-md">
        <div className="trezo-card-content bg-success-50 dark:bg-[#0a0e19] p-[20px] md:p-[25px] rounded-md mb-[10px] last:mb-0">
          <div className="flex justify-between">
            <div>
              <span className="block">Daily Limit</span>
              <h5 className="!mb-0 !text-[20px] mt-[5px]">
                $5,000
                <span className="font-normal text-base text-gray-500 dark:text-gray-400">
                  /$2250
                </span>
              </h5>
            </div>
            <div>
              <span className="inline-block text-xs font-medium px-[8px] text-danger-600 border border-danger-600 bg-danger-100 rounded-[100px] dark:bg-[#15203c] dark:border-[#15203c]">
                -45.9%
              </span>
            </div>
          </div>
          <div className="mt-[14px] flex w-full h-[10px] overflow-hidden rounded-md bg-success-200 dark:bg-[#172036]">
            <div
              className="flex flex-col justify-center overflow-hidden bg-success-500 rounded-md"
              style={{ width: "85%" }}
            ></div>
          </div>
        </div>

        <div className="trezo-card-content bg-success-500 py-[18px] px-[20px] md:px-[25px] rounded-md mb-[10px] last:mb-0 relative z-[1] flex items-center gap-[10px]">
          <Image
            src="/images/avatar-with-laptop.png"
            alt="avatar-with-laptop"
            width={75}
            height={85}
          />
          <div>
            <span className="block text-white">Get a Platinum Card</span>
            <h5 className="!mb-0 !text-white !text-[20px] mt-[5px]">
              <span className="font-normal text-base">For</span> Free
            </h5>
          </div>
          <div className="absolute bottom-0 ltr:right-0 rtl:left-0 -z-[1] rounded-br-md rtl:-scale-x-100">
            <Image
              src="/images/icons/4dots.png"
              alt="4dots"
              width={68}
              height={68}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DailyLimit;
