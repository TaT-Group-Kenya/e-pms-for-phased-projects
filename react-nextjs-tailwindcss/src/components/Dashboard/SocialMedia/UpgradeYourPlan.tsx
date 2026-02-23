"use client";

import React from "react";
import Image from "next/image"; 

const UpgradeYourPlan: React.FC = () => {
  return (
    <>
      <div className="trezo-card text-center bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content py-[5px]">
          <h3 className="!font-medium !mb-[10px] !text-lg md:!text-xl">
            Upgrade Your Plan!
          </h3>

          <p className="mx-auto leading-[1.5] md:max-w-[275px] mb-[20px] md:mb-[25px]">
            Access advanced features, enhanced support, and exclusive tools
            designed to help you achieve more.
          </p>

          <Image
            src="/images/girl-with-dog.png"
            className="mx-auto"
            alt="girl-with-dog"
            width={275}
            height={195}
          />

          <a
            href="#"
            className="inline-block mt-[5px] md:mt-[10px] px-[25px] py-[10px] md:text-md font-medium bg-primary-500 text-white transition-all hover:bg-primary-400 rounded-md"
          >
            <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px]">
              <i className="ri-fire-fill ltr:left-0 rtl:right-0 text-lg md:text-[20px] absolute top-1/2 -translate-y-1/2"></i>
              Upgrade Plan
            </span>
          </a>
        </div>
      </div>
    </>
  );
};

export default UpgradeYourPlan;
