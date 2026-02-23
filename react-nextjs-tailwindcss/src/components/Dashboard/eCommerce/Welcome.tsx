"use client";

import React from "react";
import Image from "next/image";

const Welcome: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-primary-500 mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content relative ltr:md:pr-[230px] rtl:md:pl-[230px]">
          <div className="md:pt-[5px] md:pb-[5px]">
            <h5 className="!mb-[5px] md:!mb-[2px] !font-semibold !text-white">
              Good Morning, <span className="text-[#ffcea9]">Olivia!</span>
            </h5>

            <p className="text-[#d5d9e2]">
              Here&apos;s what&apos;s happening with your store today.
            </p>

            <div className="border-t border-primary-400 mt-[15px] mb-[15px] md:mt-[30px] md:mb-[33px]"></div>

            <div className="sm:flex items-center">
              <div className="flex items-center ltr:sm:mr-[20px] ltr:2xl:mr-[40px] rtl:sm:ml-[20px] rtl:2xl:ml-[40px]">
                <div className="w-[42px] h-[42px] rtl:ml-[12px] ltr:mr-[12px] bg-primary-50 text-primary-500 rounded-md flex items-center justify-center">
                  <i className="material-symbols-outlined">shopping_bag</i>
                </div>
                <div>
                  <span className="text-[15px] md:text-md text-white block font-semibold mb-[1px] md:mb-0">
                    86 New Orders
                  </span>
                  <span className="block text-gray-200">
                    Awaiting processing
                  </span>
                </div>
              </div>

              <div className="flex items-center mt-[15px] sm:mt-0">
                <div className="w-[42px] h-[42px] rtl:ml-[12px] ltr:mr-[12px] bg-danger-50 text-danger-500 rounded-md flex items-center justify-center">
                  <i className="material-symbols-outlined">chat_error</i>
                </div>
                <div>
                  <span className="text-[15px] md:text-md text-white block font-semibold mb-[1px] md:mb-0">
                    35 Products
                  </span>
                  <span className="block text-gray-200">Out of stock</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center md:absolute ltr:right-0 rtl:left-0 md:max-w-[208.04px] md:top-1/2 md:-translate-y-1/2 mt-[20px] md:mt-0">
            <Image
              src="/images/welcome.png"
              className="inline-block"
              alt="welcome-image"
              width={418}
              height={336}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
