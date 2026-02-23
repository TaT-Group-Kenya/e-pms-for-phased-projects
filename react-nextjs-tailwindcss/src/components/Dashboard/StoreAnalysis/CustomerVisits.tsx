"use client";

import React from "react"; 

const CustomerVisits: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Customer Visits</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="flex items-center justify-between relative z-[1]">
            <div>
              <div className="rounded-full w-[25px] h-[25px] flex items-center justify-center bg-gray-50 dark:bg-[#15203c]">
                <i className="ri-user-fill"></i>
              </div>
              <span className="block max-w-[70px] leading-[1.4] mt-[6px] mb-[4px]">
                Walk-In Customers
              </span>
              <h3 className="!text-2xl !mb-[7px]">1.5K</h3>
              <span className="inline-block text-xs px-[9px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px]">
                +7%
              </span>
            </div>

            <div className="ltr:text-right rtl:text-left">
              <div className="rounded-full w-[25px] h-[25px] flex items-center justify-center bg-gray-50 dark:bg-[#15203c] ltr:ml-auto rtl:mr-auto">
                <i className="ri-user-add-fill"></i>
              </div>
              <span className="block max-w-[70px] leading-[1.4] mt-[6px] mb-[4px]">
                Repeat Customers
              </span>
              <h3 className="!text-2xl !mb-[7px]">2.1K</h3>
              <span className="inline-block text-xs px-[9px] text-danger-700 border border-danger-300 bg-danger-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px]">
                -1.4%
              </span>
            </div>

            <div className="absolute top-0 bottom-0 -z-[1] bg-gray-100 dark:bg-[#172036] w-[1px] left-1/2 -translate-x-1/2"></div>

            <div className="rounded-full w-[33px] h-[33px] text-lg absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-primary-500 flex items-center justify-center bg-primary-100 dark:bg-[#15203c]">
              <i className="ri-flashlight-line"></i>
            </div>
          </div>

          <div className="mt-[23px] flex w-full h-[8px] overflow-hidden rounded-md bg-success-600">
            <div
              className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
              style={{
                width: "32%",
              }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between mt-[5px]">
            <span className="text-xs block">32%</span>
            <span className="text-xs block">64%</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerVisits;
