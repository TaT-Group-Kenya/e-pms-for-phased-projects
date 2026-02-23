"use client";

import React from "react";
import Image from "next/image";

const Stats: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] relative rounded-md">
        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[25px]">
            <div>
              <div className="flex items-center gap-[10px] md:gap-[15px]">
                <Image
                  src="/images/icons/graduation.svg"
                  alt="graduation"
                  width={42}
                  height={42}
                />
                <div>
                  <span className="block">Total Students</span>
                  <h5 className="!mb-0 !mt-[2px] !text-[20px] !font-semibold">
                    12,560
                  </h5>
                </div>
              </div>
              <div className="mt-[15px] md:mt-[42px] flex items-center gap-[7px]">
                <div className="bg-success-100 dark:bg-[#15203c] text-success-700 rounded-[4px] w-[26px] h-[26px] flex items-center justify-center text-lg">
                  <i className="ri-arrow-right-up-line"></i>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-400">
                    +12%
                  </span>{" "}
                  last year
                </div>
              </div>
            </div>

            <div className="ltr:md:pl-[20px] rtl:md:pr-[20px]">
              <div className="flex items-center gap-[10px] md:gap-[15px]">
                <Image
                  src="/images/icons/teacher.svg"
                  alt="teacher"
                  width={42}
                  height={42}
                />
                <div>
                  <span className="block">Total Teachers</span>
                  <h5 className="!mb-0 !mt-[2px] !text-[20px] !font-semibold">
                    780
                  </h5>
                </div>
              </div>
              <div className="mt-[15px] md:mt-[42px] flex items-center gap-[7px]">
                <div className="bg-danger-100 dark:bg-[#15203c] text-danger-700 rounded-[4px] w-[26px] h-[26px] flex items-center justify-center text-[18px]">
                  <i className="ri-arrow-right-down-line"></i>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-400">
                    -10%
                  </span>{" "}
                  last year
                </div>
              </div>
            </div>

            <div className="ltr:md:pl-[20px] rtl:md:pr-[20px]">
              <div className="flex items-center gap-[10px] md:gap-[15px]">
                <Image
                  src="/images/icons/student.svg"
                  alt="student"
                  width={42}
                  height={42}
                />
                <div>
                  <span className="block">Attendance Today</span>
                  <h5 className="!mb-0 !mt-[2px] !text-[20px] !font-semibold">
                    1,425
                  </h5>
                </div>
              </div>
              <div className="mt-[15px] md:mt-[42px] flex items-center gap-[7px]">
                <div className="bg-success-100 dark:bg-[#15203c] text-success-700 rounded-[4px] w-[26px] h-[26px] flex items-center justify-center text-lg">
                  <i className="ri-arrow-right-up-line"></i>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-400">
                    +25%
                  </span>{" "}
                  last month
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[1px] absolute top-0 bottom-0 bg-gray-100 dark:bg-[#172036] left-[33.3333333333%] -translate-x-[33.3333333333%] hidden sm:block"></div>
        <div className="w-[1px] absolute top-0 bottom-0 bg-gray-100 dark:bg-[#172036] right-[33.3333333333%] translate-x-[33.3333333333%] hidden sm:block"></div>
      </div>
    </>
  );
};

export default Stats;
