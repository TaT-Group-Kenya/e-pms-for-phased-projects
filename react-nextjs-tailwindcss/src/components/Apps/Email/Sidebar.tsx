"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <form className="relative mb-[20px]">
            <label className="absolute ltr:left-[13px] rtl:right-[13px] mt-[2px] text-black dark:text-white top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined !text-lg">search</i>
            </label>
            <input
              type="text"
              className="block w-full rounded-md text-black dark:text-white bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] focus:border-primary-500 h-[40px] outline-0 transition-all text-xs placeholder:text-gray-500 dark:placeholder:text-gray-400 ltr:pl-[39px] rtl:pr-[39px] ltr:pr-[15px] rtl:pl-[15px]"
              placeholder="Search"
            />
          </form>

          <Link
            href="/apps/email/compose"
            className="block w-full bg-primary-500 text-white rounded-md md:text-md px-[22px] py-[12px] text-center font-medium transition-all hover:bg-primary-600"
          >
            <span className="inline-block ltr:pl-[29px] rtl:pr-[29px] relative">
              <i className="material-symbols-outlined absolute !text-[20px] ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                edit
              </i>
              Compose
            </span>
          </Link>

          <ul className="my-[20px] md:my-[25px]">
            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="/apps/email/inbox/"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px] dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "/apps/email/inbox/" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  inbox
                </i>
                Inbox
                <span className="block font-normal text-xs text-gray-500 dark:text-gray-400">
                  10
                </span>
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  star_rate
                </i>
                Starred
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  alarm
                </i>
                Snoozed
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  send
                </i>
                Sent
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  draft
                </i>
                Drafts
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  bookmark
                </i>
                Important
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  auto_read_pause
                </i>
                Chats
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  schedule_send
                </i>
                Scheduled
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  forward_to_inbox
                </i>
                All Mail
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  live_help
                </i>
                Spam
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  delete
                </i>
                Trash
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  account_circle
                </i>
                Personal
              </Link>
            </li>

            <li className="mb-[13px] md:mb-[17px] last:mb-0">
              <Link
                href="#"
                className={`flex items-center justify-between relative ltr:pl-[30px] rtl:pr-[30px]  dark:text-white transition-all hover:text-primary-500 font-medium ${
                  pathname === "#" ? "text-primary-500" : "text-black dark:text-white"
                }`}
              >
                <i className="material-symbols-outlined !text-lg absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                  trip
                </i>
                Company
              </Link>
            </li>
          </ul>

          <button
            type="button"
            className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
          >
            <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
              <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                add
              </i>
              Add New Label
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
