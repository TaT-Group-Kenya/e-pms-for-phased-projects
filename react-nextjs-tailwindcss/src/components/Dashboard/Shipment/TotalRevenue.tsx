"use client";

import React from "react";

const TotalRevenue: React.FC = () => {
  return (
    <>
      <div
        className="trezo-card p-[20px] md:p-[25px] rounded-md"
        style={{
          background: "linear-gradient(108deg, #3A4252 0%, #23272E 100%)",
        }}
      >
        <div className="trezo-card-content">
          <div className="flex justify-between">
            <div>
              <span className="inline-block px-[8.5px] text-success-600 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px] text-xs">
                +30%
              </span>
            </div>

            <div className="ltr:text-right rtl:text-left">
              <span className="block text-gray-300 text-xs mb-px">
                Last 30 days
              </span>
              <span className="block font-bold text-success-500 text-xs">
                $13,250
              </span>
            </div>
          </div>

          <div className="mt-[20px] md:mt-[25px] flex items-end justify-between">
            <div>
              <span className="block mb-[4px] text-gray-300">
                Total Revenue
              </span>
              <h3 className="!mb-0 !text-[20px] !text-white">$99,590</h3>
            </div>

            <div className="w-[55px] lg:w-[60px] h-[55px] lg:h-[60px] flex items-center justify-center rounded-full text-white bg-success-500">
              <i className="material-symbols-outlined !text-[28px]">
                attach_money
              </i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalRevenue;
