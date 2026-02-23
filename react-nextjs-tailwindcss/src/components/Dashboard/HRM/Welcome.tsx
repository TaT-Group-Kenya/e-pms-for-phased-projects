"use client";

import React from "react";
import Image from "next/image";

const Welcome: React.FC = () => {
  return (
    <>
      <div className="trezo-card mb-[25px]">
        <div className="trezo-card-content lg:flex justify-between items-center">
          <div>
            <h5 className="!mb-[6px] md:!mb-[3px] !font-semibold !text-[20px]">
              Welcome Back, <span className="text-primary-500">Olivia!</span>
            </h5>
            <p>
              Monitor and manage employee performance, attendance and more in
              one place.
            </p>
          </div>

          <div className="flex items-center gap-[10px] mt-[12px] lg:mt-0">
            <button
              type="button"
              className="flex gap-[4px] items-center text-purple-700 bg-purple-100 dark:bg-[#15203c] rounded-[4px] py-[4.5px] px-[10px] md:px-[12.5px] transition-all hover:bg-purple-200"
            >
              <Image
                src="/images/icons/crown.svg"
                alt="crown"
                width={18}
                height={18}
              />
              Plan Upgrade
            </button>

            <button
              type="button"
              className="flex gap-[4px] items-center text-orange-700 bg-orange-100 dark:bg-[#15203c] rounded-[4px] py-[4.5px] px-[10px] md:px-[12.5px] transition-all hover:bg-orange-200"
            >
              <Image
                src="/images/icons/file-download.svg"
                alt="file-download"
                width={18}
                height={18}
              />
              Export Reports
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
