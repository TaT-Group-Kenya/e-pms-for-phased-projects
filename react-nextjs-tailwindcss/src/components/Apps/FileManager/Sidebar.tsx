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
          <form className="relative mb-[20px] md:mb-[27px]">
            <input
              type="text"
              className="block w-full rounded-md text-black dark:text-white px-[15px] bg-gray-50 dark:bg-[#15203c] border border-gray-50 dark:border-[#15203c] focus:border-primary-500 h-[44px] outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Search here..."
            />

            <button className="absolute text-primary-500 mt-px ltr:right-[15px] rtl:left-[15px] top-1/2 -translate-y-1/2 hover:text-primary-400">
              <i className="material-symbols-outlined !text-[20px]">search</i>
            </button>
          </form>

          <ul className="mb-[20px] md:mb-[25px]">
            <li className="font-medium mb-[15px] md:mb-[19px] last:mb-0">
              <Link
                href="/apps/file-manager/my-drive/"
                className={`relative flex items-center justify-between ltr:pl-[28px] rtl:pr-[28px] transition-all hover:text-primary-500 ${
                  pathname === "/apps/file-manager/my-drive/"
                    ? "text-primary-500 "
                    : ""
                }`}
              >
                <i className="material-symbols-outlined absolute !text-lg ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-[.5px]">
                  drive_eta
                </i>
                My Drive
                <span className="text-sm font-normal block text-gray-500 dark:text-gray-400">
                  4
                </span>
              </Link>

              <ul className="ltr:pl-[28px] rtl:pr-[28px] mt-[15px] md:mt-[17px] mb-[17px] md:mb-[21px]">
                <li className="font-normal mb-[12px] md:mb-[14px] last:mb-0">
                  <Link
                    href="/apps/file-manager/assets/"
                    className={`nline-block relative transition-all hover:text-primary-500 ltr:pl-[15px] rtl:pr-[15px] ${
                      pathname === "/apps/file-manager/assets/"
                        ? "text-primary-500 "
                        : ""
                    }`}
                  >
                    <span className="ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full absolute border border-primary-500"></span>
                    Assets
                  </Link>
                </li>

                <li className="font-normal mb-[12px] md:mb-[14px] last:mb-0">
                  <Link
                    href="/apps/file-manager/projects/"
                    className={`nline-block relative transition-all hover:text-primary-500 ltr:pl-[15px] rtl:pr-[15px] ${
                      pathname === "/apps/file-manager/projects/"
                        ? "text-primary-500 "
                        : ""
                    }`}
                  >
                    <span className="ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full absolute border border-primary-500"></span>
                    Projects
                  </Link>
                </li>

                <li className="font-normal mb-[12px] md:mb-[14px] last:mb-0">
                  <Link
                    href="/apps/file-manager/personal/"
                    className={`nline-block relative transition-all hover:text-primary-500 ltr:pl-[15px] rtl:pr-[15px] ${
                      pathname === "/apps/file-manager/personal/"
                        ? "text-primary-500 "
                        : ""
                    }`}
                  >
                    <span className="ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full absolute border border-primary-500"></span>
                    Personal
                  </Link>
                </li>

                <li className="font-normal mb-[12px] md:mb-[14px] last:mb-0">
                  <Link
                    href="/apps/file-manager/applications/"
                    className={`nline-block relative transition-all hover:text-primary-500 ltr:pl-[15px] rtl:pr-[15px] ${
                      pathname === "/apps/file-manager/applications/"
                        ? "text-primary-500 "
                        : ""
                    }`}
                  >
                    <span className="ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full absolute border border-primary-500"></span>
                    Applications
                  </Link>
                </li>
              </ul>
            </li>

            <li className="font-medium mb-[15px] md:mb-[19px] last:mb-0">
              <Link
                href="/apps/file-manager/documents/"
                className={`relative flex items-center justify-between ltr:pl-[28px] rtl:pr-[28px] transition-all text-black dark:text-white hover:text-primary-500 ${
                  pathname === "/apps/file-manager/documents/"
                    ? "text-primary-500 "
                    : ""
                }`}
              >
                <i className="material-symbols-outlined text-success-600 absolute !text-lg ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-[.5px]">
                  description
                </i>
                Documents
              </Link>
            </li>

            <li className="font-medium mb-[15px] md:mb-[19px] last:mb-0">
              <Link
                href="/apps/file-manager/media/"
                className={`relative flex items-center justify-between ltr:pl-[28px] rtl:pr-[28px] transition-all text-black dark:text-white hover:text-primary-500 ${
                  pathname === "/apps/file-manager/media/"
                    ? "text-primary-500 "
                    : ""
                }`}
              >
                <i className="material-symbols-outlined text-info-400 absolute !text-lg ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-[.5px]">
                  perm_media
                </i>
                Media
              </Link>
            </li>

            <li className="font-medium mb-[15px] md:mb-[19px] last:mb-0">
              <Link
                href="/apps/file-manager/recents/"
                className={`relative flex items-center justify-between ltr:pl-[28px] rtl:pr-[28px] transition-all text-black dark:text-white hover:text-primary-500 ${
                  pathname === "/apps/file-manager/recents/"
                    ? "text-primary-500 "
                    : ""
                }`}
              >
                <i className="material-symbols-outlined text-purple-500 absolute !text-lg ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-[.5px]">
                  schedule
                </i>
                Recents
              </Link>
            </li>

            <li className="font-medium mb-[15px] md:mb-[19px] last:mb-0">
              <Link
                href="/apps/file-manager/important/"
                className={`relative flex items-center justify-between ltr:pl-[28px] rtl:pr-[28px] transition-all text-black dark:text-white hover:text-primary-500 ${
                  pathname === "/apps/file-manager/important/"
                    ? "text-primary-500 "
                    : ""
                }`}
              >
                <i className="material-symbols-outlined text-warning-500 absolute !text-lg ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-[.5px]">
                  grade
                </i>
                Important
              </Link>
            </li>

            <li className="font-medium mb-[15px] md:mb-[19px] last:mb-0">
              <Link
                href="#"
                className={`relative flex items-center justify-between ltr:pl-[28px] rtl:pr-[28px] transition-all text-black dark:text-white hover:text-primary-500 ${
                  pathname === "#" ? "text-primary-500 " : ""
                }`}
              >
                <i className="material-symbols-outlined text-secondary-500 absolute !text-lg ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-[.5px]">
                  report_gmailerrorred
                </i>
                Spam
                <span className="text-sm font-normal block text-gray-500 dark:text-gray-400">
                  10
                </span>
              </Link>
            </li>

            <li className="font-medium mb-[15px] md:mb-[19px] last:mb-0">
              <Link
                href="#"
                className={`relative flex items-center justify-between ltr:pl-[28px] rtl:pr-[28px] transition-all text-black dark:text-white hover:text-primary-500 ${
                  pathname === "#" ? "text-primary-500 " : ""
                }`}
              >
                <i className="material-symbols-outlined text-danger-500 absolute !text-lg ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 -mt-[.5px]">
                  delete
                </i>
                Trash
                <span className="text-sm font-normal block text-gray-500 dark:text-gray-400">
                  15
                </span>
              </Link>
            </li>
          </ul>

          <div className="border-t border-gray-100 dark:border-[#172036] -mx-[20px] md:-mx-[25px] px-[20px] md:px-[25px] pt-[20px] md:pt-[25px]">
            <h6 className="!mb-[11px] !text-[15px]">Storage Status</h6>

            <span className="block text-sm ">% 50 GB used of 100 GB</span>

            <div className="mt-[11px] flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
              <div
                className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
