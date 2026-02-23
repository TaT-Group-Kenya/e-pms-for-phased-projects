"use client";

import React from "react";

const FinishedProjects: React.FC = () => {
  return (
    <>
      <div className="bg-success-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
        <div className="flex items-center">
          <div className="text-success-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
            <i className="material-symbols-outlined !text-5xl">
              assignment_turned_in
            </i>
          </div>
          <div>
            <span className="block">Finished Projects</span>
            <h5 className="!mb-0 !text-[20px] mt-[2px]">135</h5>
          </div>
        </div>
        <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
          <span className="block text-sm">Projects this month</span>
          <span className="inline-block text-sm text-danger-700 py-[1px] px-[8.3px] border border-danger-300 bg-danger-100 dark:bg-[#15203c] dark:border-[#172036] rounded-xl">
            -15%
          </span>
        </div>
      </div>
    </>
  );
};

export default FinishedProjects;
