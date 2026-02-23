"use client";

import React from "react";

const Overview: React.FC = () => {
  // Function to format the current date
  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="trezo-card mb-[25px]">
        <div className="trezo-card-content lg:flex justify-between items-center">
          <div>
            <h5 className="!mb-[6px] md:!mb-[3px] !font-semibold !text-[20px]">
              School Overview Dashboard
            </h5>
            <p>Manage Students, Teachers, and School Data Seamlessly!</p>
          </div>

          <div className="flex items-center gap-[10px] mt-[12px] lg:mt-0">
            <div className="rounded-md inline-block text-primary-500 py-[3.5px] px-[15px] bg-primary-50 dark:bg-[#0a0e19] border border-primary-100 dark:border-[#172036]">
              <span className="inline-block relative ltr:pl-[24px] rtl:pr-[24px]">
                <i className="ri-calendar-line absolute text-[16px] top-1/2 -translate-y-1/2 ltr:left-0 rtl:right-0"></i>
                Today - {getCurrentDate()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
