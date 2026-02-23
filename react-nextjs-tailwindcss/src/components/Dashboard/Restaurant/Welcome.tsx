"use client";

import React from "react";
import Image from "next/image";

const Welcome: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-orange-400 p-[20px] md:p-[25px] rounded-md mb-[25px]">
        <div className="trezo-card-content md:py-[23.5px]">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-[25px]">
            <div className="text-center ltr:md:text-left rtl:md:text-right ltr:lg:-mr-[55px] rtl:lg:-ml-[55px] 2xl:ltr:mr-0 2xl:rtl:ml-0 2xl:max-w-[330px]">
              <span className="inline-block md:text-md text-orange-100 py-[1px] px-[13px] mb-[12px] font-medium bg-[#212529]">
                Hello Olivia!
              </span>

              <h1 className="!-tracking-[0.5px] !leading-[1.2] !mb-0 !text-xl md:!text-2xl 2xl:!text-3xl !text-white">
                Here Your Restaurant Stats Today.
              </h1>

              <div className="mt-[15px] md:mt-[25px] flex items-center justify-center md:justify-start gap-[25px] 2xl:gap-[40px]">
                <div className="relative ltr:pl-[33px] rtl:pr-[33px]">
                  <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 text-white top-[2px]">
                    order_approve
                  </i>
                  <span className="block text-white">Total Orders</span>
                  <h6 className="!mb-0 !text-md !text-white !mt-[2px]">12051+</h6>
                </div>

                <div className="relative ltr:pl-[33px] rtl:pr-[33px]">
                  <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 text-white top-[2px]">
                    group
                  </i>
                  <span className="block text-white">Total Users</span>
                  <h6 className="!mb-0 !text-md !text-white !mt-[2px]">153k+</h6>
                </div>
              </div>
            </div>

            <div className="relative text-center ltr:mr-auto rtl:ml-auto ltr:md:mr-0 rtl:md:ml-0 ltr:text-right rtl:text-left max-w-[217px] ltr:ml-auto rtl:mr-auto py-[10px] ltr:pr-[22px] rtl:pl-[22px]">
              <Image
                src="/images/chowmein.png"
                alt="chowmein"
                className="inline-block"
                width={185}
                height={185}
              />
              <Image
                src="/images/icons/3dots1.png"
                alt="3dots1"
                className="inline-block absolute bottom-0 ltr:right-0 rtl:left-0 rtl:-scale-x-[1]"
                width={52}
                height={55}
              />
              <Image
                src="/images/icons/3dots2.png"
                alt="3dots2"
                className="inline-block absolute top-0 ltr:-left-[10px] rtl:-right-[10px] rtl:-scale-x-[1]"
                width={41}
                height={45}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
