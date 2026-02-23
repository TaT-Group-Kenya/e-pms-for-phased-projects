"use client";

import React from "react";

const ActiveProjects: React.FC = () => {
  return (
    <>
      <div className="bg-orange-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
        <div className="flex items-center">
          <div className="text-orange-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
            <i className="material-symbols-outlined !text-5xl">stacks</i>
          </div>
          <div>
            <span className="block">Active Projects</span>
            <h5 className="!mb-0 !text-[20px] !mt-[2px]">425</h5>
          </div>
        </div>
        <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
          <span className="block text-sm">Projects this month</span>
          <span className="inline-block text-sm text-success-700 py-[1px] px-[8.3px] border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] rounded-xl">
            +5.75%
          </span>
        </div>
      </div>
    </>
  );
};

export default ActiveProjects;
