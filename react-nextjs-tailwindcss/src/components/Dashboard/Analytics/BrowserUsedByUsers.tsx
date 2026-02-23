"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";

type BrowserData = {
  browser: string;
  image: string;
  usersPercentage: string;
  sessions: string;
  bounceRate: string;
  avgSessionDuration: string;
};

const BrowserUsedByUsers: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>(
    "Oct 01 - Oct 31, 2024"
  );

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  const [browserData, setBrowserData] = useState<BrowserData[]>([]);

  // Simulate fetching data from an API or other source
  useEffect(() => {
    const fetchData = async () => {
      // Replace with your actual API call
      const data: BrowserData[] = [
        {
          browser: "Google Chrome",
          image: "/images/browsers/google-chrome.svg",
          usersPercentage: "58.4%",
          sessions: "12,345",
          bounceRate: "34.2%",
          avgSessionDuration: "3m 15s",
        },
        {
          browser: "Safari",
          image: "/images/browsers/safari.svg",
          usersPercentage: "25.1%",
          sessions: "5,289",
          bounceRate: "40.5%",
          avgSessionDuration: "2m 45s",
        },
        {
          browser: "Microsoft Edge",
          image: "/images/browsers/microsoft-edge.svg",
          usersPercentage: "10.2%",
          sessions: "2,134",
          bounceRate: "29.8%",
          avgSessionDuration: "4m 05s",
        },
        {
          browser: "Mozilla Firefox",
          image: "/images/browsers/mozilla-firefox.svg",
          usersPercentage: "4.3%",
          sessions: "897",
          bounceRate: "38.0%",
          avgSessionDuration: "3m 00s",
        },
        {
          browser: "Opera Mini",
          image: "/images/browsers/opera-mini.svg",
          usersPercentage: "1.5%",
          sessions: "315",
          bounceRate: "35.7%",
          avgSessionDuration: "2m 30s",
        },
        {
          browser: "Others",
          image: "/images/browsers/others.svg",
          usersPercentage: "0.5%",
          sessions: "105",
          bounceRate: "42.1%",
          avgSessionDuration: "2m 10s",
        },
      ];
      setBrowserData(data);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Browser Used By Users</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {[
                  "Sep 01 - Sep 30, 2024",
                  "Aug 01 - Aug 31, 2024",
                  "Jul 01 - Jul 31, 2024",
                ].map((option) => (
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
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="font-medium text-xs text-center px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Browser
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Users (%)
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Sessions
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Bounce Rate (%)
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[7px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Avg. Session Duration
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {browserData.map((browser, index) => (
                  <tr key={index}>
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <Image
                          alt={`${browser.browser}`}
                          src={browser.image}
                          width={16}
                          height={16}
                        />
                        <span className="block font-medium ltr:ml-[10px] rtl:mr-[10px]">
                          {browser.browser}
                        </span>
                      </div>
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      {browser.usersPercentage}
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      {browser.sessions}
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      {browser.bounceRate}
                    </td>

                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[10px] border-b border-gray-100 dark:border-[#172036]">
                      {browser.avgSessionDuration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowserUsedByUsers;
