"use client";

import React from "react";
import Link from "next/link";

const ChangePasswordForm: React.FC = () => {
  return (
    <>
      <form>
        <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
          <div className="mb-[20px] sm:mb-0 relative" id="passwordHideShow">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Old Password
            </label>
            <input
              type="password"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              id="password"
              placeholder="Type password"
            />
          </div>

          <div className="mb-[20px] sm:mb-0 relative" id="passwordHideShow2">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              New Password
            </label>
            <input
              type="password"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              id="password2"
              placeholder="Type password"
            />
          </div>

          <div
            className="sm:col-span-2 mb-[20px] sm:mb-0 relative"
            id="passwordHideShow3"
          >
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Confirm Password
            </label>
            <input
              type="password"
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              id="password3"
              placeholder="Type password"
            />
          </div>
        </div>

        <div className="mt-[20px] md:mt-[25px]">
          <button
            type="button"
            className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                check
              </i>
              Change Password
            </span>
          </button>
          
          <Link
            href="/authentication/forgot-password/"
            className="inline-block text-danger-500 ltr:ml-[23px] rtl:mr-[23px]"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </>
  );
};

export default ChangePasswordForm;
