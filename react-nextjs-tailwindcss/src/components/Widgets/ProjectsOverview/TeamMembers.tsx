"use client";

import React from "react";
import Image from "next/image";

const TeamMembers: React.FC = () => {
  return (
    <>
      <div className="bg-purple-50 dark:bg-[#15203c] rounded-md py-[22px] px-[20px]">
        <div className="flex items-center">
          <div className="text-purple-500 leading-none ltr:mr-[10px] rtl:ml-[10px]">
            <i className="material-symbols-outlined !text-5xl">group</i>
          </div>
          <div>
            <span className="block">Team Members</span>
            <h5 className="!mb-0 !text-[20px] !mt-[2px]">1235</h5>
          </div>
        </div>
        <div className="mt-[14px] flex items-center justify-between">
          <span className="block text-sm">Hard Workers</span>
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
    </>
  );
};

export default TeamMembers;
