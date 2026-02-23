"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import TotalCallsChart from "./TotalCallsChart";
import AnsweredCallsChart from "./AnsweredCallsChart";
import MissedCallsChart from "./MissedCallsChart";

const Overview: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Year");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Tab
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Overview</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["This Day", "This Week", "This Month", "This Year"].map(
                  (option) => (
                    <MenuItem
                      key={option}
                      as="div"
                      className={`block w-full transition-all text-black cursor-pointer ltr:text-left rtl:text-right relative py-[8px] px-[20px] hover:bg-gray-50 dark:text-white dark:hover:bg-black ${
                        selectedOption === option ? "font-semibold" : ""
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </MenuItem>
                  )
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="trezo-tabs" id="trezo-tabs">
            <ul className="overview-navs grid grid-cols-1 sm:grid-cols-3 gap-[15px] md:gap-[25px]">
              <li className="nav-item">
                <button
                  onClick={() => handleTabClick(0)}
                  className={`nav-link block w-full py-[15px] px-[20px] rounded-md bg-primary-50 ltr:text-left rtl:text-right transition-all dark:bg-[#0a0e19] ${
                    activeTab === 0 ? "active" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block">Total Calls</span>
                      <h5 className="!mb-0 !text-lg md:!text-xl !font-semibold">
                        26,435
                      </h5>
                    </div>
                    <Image
                      src="/images/icons/call5.svg"
                      alt="call"
                      width={32}
                      height={32}
                    />
                    <Image
                      src="/images/icons/call4.svg"
                      className="hidden"
                      alt="call"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="inline-block font-medium text-black dark:text-white relative ltr:pl-[27px] rtl:pr-[27px] mt-[32px]">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-success-600 !text-[20px]">
                      trending_up
                    </i>
                    +15%{" "}
                    <span className="text-gray-500 dark:text-gray-400 font-normal">
                      last year
                    </span>
                  </span>
                </button>
              </li>

              <li className="nav-item">
                <button
                  onClick={() => handleTabClick(1)}
                  className={`nav-link block w-full py-[15px] px-[20px] rounded-md bg-purple-50 ltr:text-left rtl:text-right transition-all dark:bg-[#0a0e19] ${
                    activeTab === 1 ? "active" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block">Answered Calls</span>
                      <h5 className="!mb-0 !text-lg md:!text-xl !font-semibold">
                        18,520
                      </h5>
                    </div>
                    <Image
                      src="/images/icons/call3.svg"
                      alt="call"
                      width={32}
                      height={32}
                    />
                    <Image
                      src="/images/icons/call6.svg"
                      className="hidden"
                      alt="call"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="inline-block font-medium text-black dark:text-white relative ltr:pl-[27px] rtl:pr-[27px] mt-[32px]">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-success-600 !text-[20px]">
                      trending_up
                    </i>
                    +7.5%{" "}
                    <span className="text-gray-500 dark:text-gray-400 font-normal">
                      last year
                    </span>
                  </span>
                </button>
              </li>

              <li className="nav-item">
                <button
                  onClick={() => handleTabClick(2)}
                  className={`nav-link block w-full py-[15px] px-[20px] rounded-md bg-orange-50 ltr:text-left rtl:text-right transition-all dark:bg-[#0a0e19] ${
                    activeTab === 2 ? "active" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block">Missed Calls</span>
                      <h5 className="!mb-0 !text-lg md:!text-xl !font-semibold">
                        3,735
                      </h5>
                    </div>
                    <Image
                      src="/images/icons/call7.svg"
                      alt="call"
                      width={32}
                      height={32}
                    />
                    <Image
                      src="/images/icons/call8.svg"
                      className="hidden"
                      alt="call"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="inline-block font-medium text-black dark:text-white relative ltr:pl-[27px] rtl:pr-[27px] mt-[32px]">
                    <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-orange-600 !text-[20px]">
                      trending_down
                    </i>
                    -25%{" "}
                    <span className="text-gray-500 dark:text-gray-400 font-normal">
                      last year
                    </span>
                  </span>
                </button>
              </li>
            </ul>

            <div>
              {activeTab === 0 && <TotalCallsChart />}
              {activeTab === 1 && <AnsweredCallsChart />}
              {activeTab === 2 && <MissedCallsChart />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
