"use client";

import React from "react";

const TotalEnrolled: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <span className="block">Total Enrolled</span>
          
          <h5 className="!text-[20px] mt-[3px] !mb-0">75k+</h5>

          <div className="flex items-center justify-center mx-auto text-purple-500 bg-purple-100 dark:bg-[#15203c] w-[77px] h-[77px] my-[15px] rounded-full">
            <i className="material-symbols-outlined !text-[32px]">
              collections_bookmark
            </i>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="block">This Month</span>
            <span className="leading-none text-danger-500">
              <i className="material-symbols-outlined !text-[20px]">
                trending_down
              </i>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalEnrolled;
