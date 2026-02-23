"use client";

import React from "react"; 

const TotalOrder: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="flex justify-between">
            <div>
              <span className="inline-block px-[8.5px] text-danger-600 border border-danger-300 bg-danger-100 dark:bg-[#15203c] dark:border-[#15203c] text-sm rounded-[100px] text-xs">
                -2.5%
              </span>
            </div>
            <div className="ltr:text-right rtl:text-left">
              <span className="block text-xs mb-px">Last 30 days</span>
              <span className="block font-bold text-orange-500 text-xs">
                -140
              </span>
            </div>
          </div>
          <div className="mt-[20px] md:mt-[25px] flex items-end justify-between">
            <div>
              <span className="block mb-[4px]">Total Order</span>
              <h3 className="!mb-0 !text-[20px] !text-black dark:!text-white">
                49,120
              </h3>
            </div>
            <div className="w-[55px] lg:w-[60px] h-[55px] lg:h-[60px] flex items-center justify-center rounded-full text-white bg-orange-500">
              <i className="material-symbols-outlined !text-[28px]">
                deployed_code
              </i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalOrder;
