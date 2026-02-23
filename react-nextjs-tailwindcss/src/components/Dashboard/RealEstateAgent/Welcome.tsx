"use client";

import React from "react";
import Image from "next/image";

const Welcome: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-orange-400 p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content py-[8px] md:py-[10px] xl:pt-[10px] xl:pb-[70px] lg:px-[25px] 2xl:px-[75px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] items-center">
            <div className="max-w-[400px] mx-auto lg:mx-0 md:max-w-[480px] text-center ltr:lg:text-left rtl:lg:text-right">
              <span className="inline-block text-base md:text-[15px] lg:text-md text-orange-100 py-[1px] px-[13px] mb-[12px] bg-[#212529] font-medium">
                Hello Olivia!
              </span>
              <h1 className="!mb-0 !text-white !text-xl md:!text-2xl lg:!text-3xl -tracking-[.5px]">
                Welcome Back! Ready to Close More Deals Today?
              </h1>
            </div>
            <div className="text-center ltr:lg:text-right rtl:lg:text-left">
              <Image
                src="/images/bank.png"
                className="inline-block"
                alt="bank-image"
                width={470}
                height={175}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
