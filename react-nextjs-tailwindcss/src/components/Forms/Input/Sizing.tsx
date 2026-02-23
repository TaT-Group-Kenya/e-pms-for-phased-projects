"use client";

import React from "react"; 

const Sizing: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Sizing</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="mb-[20px] md:mb-[25px] last:mb-0">
            <input
              type="text"
              className="h-[60px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              placeholder="name@example.com"
            />
          </div>

          <div className="mb-[20px] md:mb-[25px] last:mb-0">
            <input
              type="text"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              placeholder="name@example.com"
            />
          </div>

          <div className="mb-[20px] md:mb-[25px] last:mb-0">
            <input
              type="text"
              className="h-[45px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              placeholder="name@example.com"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sizing;
