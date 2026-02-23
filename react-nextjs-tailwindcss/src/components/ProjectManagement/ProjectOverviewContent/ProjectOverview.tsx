"use client";

import React from "react";
import Image from "next/image"; 

const ProjectOverview: React.FC = () => {
  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Project Overview</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
            <div>
              <div className="bg-primary-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
                <div className="flex items-center">
                  <div className="text-primary-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                    <i className="material-symbols-outlined !text-5xl">
                      history_toggle_off
                    </i>
                  </div>
                  <div>
                    <span className="block">Total Hours</span>
                    <h5 className="!mb-0 !text-[20px] mt-[2px]">102</h5>
                  </div>
                </div>
                <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
                  <span className="block text-sm">Hours this week</span>
                  <span className="inline-block text-sm text-success-700 py-[1px] px-[8.3px] border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] rounded-xl">
                    +10%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-orange-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
                <div className="flex items-center">
                  <div className="text-orange-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                    <i className="material-symbols-outlined !text-5xl">
                      local_cafe
                    </i>
                  </div>
                  <div>
                    <span className="block">Total Cup of Coffee</span>
                    <h5 className="!mb-0 !text-[20px] mt-[2px]">89</h5>
                  </div>
                </div>
                <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
                  <span className="block text-sm">Coffee this week</span>
                  <span className="inline-block text-sm text-success-700 py-[1px] px-[8.3px] border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] rounded-xl">
                    +5.75%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-success-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
                <div className="flex items-center">
                  <div className="text-success-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                    <i className="material-symbols-outlined !text-5xl">
                      door_open
                    </i>
                  </div>
                  <div>
                    <span className="block">Total Days</span>
                    <h5 className="!mb-0 !text-[20px] mt-[2px]">54</h5>
                  </div>
                </div>
                <div className="mt-[15px] sm:mt-[25px] flex items-center justify-between">
                  <span className="block text-sm">Days this week</span>
                  <span className="inline-block text-sm text-danger-700 py-[1px] px-[8.3px] border border-danger-300 bg-danger-100 dark:bg-[#15203c] dark:border-[#172036] rounded-xl">
                    -15%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-purple-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
                <div className="flex items-center">
                  <div className="text-purple-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
                    <i className="material-symbols-outlined !text-5xl">group</i>
                  </div>
                  <div>
                    <span className="block">Team Members</span>
                    <h5 className="!mb-0 !text-[20px] mt-[2px]">55+</h5>
                  </div>
                </div>
                
                <div className="mt-[14px] flex items-center justify-between">
                  <span className="block text-sm">Hard Worker</span>
                  <div className="flex items-center">
                    <Image
                      src="/images/users/user15.jpg"
                      className="rounded-full inline-block w-[34px] h-[34px] ltr:-mr-[14px] rtl:-ml-[14px] border border-white"
                      alt="user-image"
                      width={34}
                      height={34}
                    />
                    <Image
                      src="/images/users/user14.jpg"
                      className="rounded-full inline-block w-[34px] h-[34px] ltr:-mr-[14px] rtl:-ml-[14px] border border-white"
                      alt="user-image"
                      width={34}
                      height={34}
                    />
                    <Image
                      src="/images/users/user13.jpg"
                      className="rounded-full inline-block w-[34px] h-[34px] ltr:-mr-[14px] rtl:-ml-[14px] border border-white"
                      alt="user-image"
                      width={34}
                      height={34}
                    />
                    <Image
                      src="/images/users/user12.jpg"
                      className="rounded-full inline-block w-[34px] h-[34px] ltr:-mr-[14px] rtl:-ml-[14px] border border-white"
                      alt="user-image"
                      width={34}
                      height={34}
                    />
                    <span className="w-[34px] h-[34px] rounded-full border border-white bg-primary-500 text-white font-medium flex items-center justify-center text-xs">
                      +55
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectOverview;
