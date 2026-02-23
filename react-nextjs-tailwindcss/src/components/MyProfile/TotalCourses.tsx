"use client";

import React from "react";

const TotalCourses: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <span className="block">Total Courses</span>

          <h5 className="!text-[20px] !mt-[3px] !mb-0">45.6k</h5>

          <div className="flex items-center justify-center mx-auto text-secondary-500 bg-secondary-100 dark:bg-[#15203c] w-[77px] h-[77px] my-[15px] rounded-full">
            <i className="material-symbols-outlined !text-[32px]">
              auto_stories
            </i>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="block">This Month</span>
            <span className="leading-none text-success-600">
              <i className="material-symbols-outlined !text-[20px]">
                trending_up
              </i>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalCourses;
