"use client";

import React from "react"; 

const Stats: React.FC = () => {
  return (
    <>
      <div className="relative mt-[25px] lg:-mt-[25px] lg:mx-[25px] 2xl:mx-[40px]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[25px]">
          {/* New Customers */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-content flex justify-between">
              <div>
                <span className="block">New Customers</span>
                <h3 className="!text-2xl !mt-[4px] !mb-[8px]">14.5k</h3>
                <span className="inline-block text-xs px-[9px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px]">
                  +7%
                </span>
              </div>
              <div className="bg-primary-100 dark:bg-[#15203c] text-primary-500 rounded-full w-[48px] h-[48px] flex items-center justify-center text-xl">
                <i className="ri-user-3-fill"></i>
              </div>
            </div>
          </div>

          {/* Sales */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-content flex justify-between">
              <div>
                <span className="block">Sales</span>
                <h3 className="!text-2xl !mt-[4px] !mb-[8px]">$64.5k</h3>
                <span className="inline-block text-xs px-[9px] text-danger-700 border border-danger-300 bg-danger-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px]">
                  -1.4%
                </span>
              </div>
              <div className="bg-success-100 dark:bg-[#15203c] text-success-500 rounded-full w-[48px] h-[48px] flex items-center justify-center text-xl">
                <i className="ri-money-dollar-circle-fill"></i>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
            <div className="trezo-card-content flex justify-between">
              <div>
                <span className="block">Products</span>
                <h3 className="!text-2xl !mt-[4px] !mb-[8px]">11.9k</h3>
                <span className="inline-block text-xs px-[9px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px]">
                  +1.1%
                </span>
              </div>
              <div className="bg-purple-100 dark:bg-[#15203c] text-purple-500 rounded-full w-[48px] h-[48px] flex items-center justify-center text-xl">
                <i className="ri-price-tag-3-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;
