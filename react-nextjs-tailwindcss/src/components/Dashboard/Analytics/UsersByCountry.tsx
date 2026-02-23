"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import WorldMap from "react-svg-worldmap";
import Image from "next/image";

const UsersByCountry: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  const data = [
    { country: "us", value: 331883986 }, // United States
    { country: "gb", value: 67886011 }, // United Kingdom
    { country: "ca", value: 37742154 }, // Canada
    { country: "au", value: 25687041 }, // Australia
  ];

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Users by Country</h5>
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
                {["Last Day", "Last Week", "Last Month", "Last Year"].map(
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
          <div className="flex items-center justify-center min-h-[160px] -my-[4px]">
            <WorldMap
              backgroundColor="transparent"
              color="blue"
              value-suffix="people"
              size="sm"
              data={data}
            />
          </div>

          <ul className="grid grid-cols-2">
            <li>
              <div className="relative mt-[14px] md:mt-[16px] ltr:pl-[30px] rtl:pr-[30px] pt-[14px] md:pt-[16px]">
                <Image
                  src="/images/flags/usa.svg"
                  className="absolute top-[18px] ltr:left-0 rtl:right-0 w-[20px]"
                  alt="usa"
                  width={20}
                  height={20}
                />
                <span className="block font-medium text-xs mb-[4px]">
                  United States
                </span>
                <h6 className="!mb-0 !text-md !font-semibold">
                  12,800{" "}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    35.6%
                  </span>
                </h6>
              </div>
            </li>
            <li>
              <div className="relative mt-[14px] md:mt-[16px] ltr:pl-[30px] rtl:pr-[30px] pt-[14px] md:pt-[16px]">
                <Image
                  src="/images/flags/uk.svg"
                  className="absolute top-[18px] ltr:left-0 rtl:right-0 w-[20px]"
                  alt="usa"
                  width={20}
                  height={20}
                />
                <span className="block font-medium text-xs mb-[4px]">
                  United Kingdom
                </span>
                <h6 className="!mb-0 !text-md !font-semibold">
                  6,750{" "}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    18.7%
                  </span>
                </h6>
              </div>
            </li>
            <li>
              <div className="relative border-t border-gray-100 dark:border-[#172036] mt-[14px] md:mt-[16px] ltr:pl-[30px] rtl:pr-[30px] pt-[14px] md:pt-[16px]">
                <Image
                  src="/images/flags/canada.svg"
                  className="absolute top-[18px] ltr:left-0 rtl:right-0 w-[20px]"
                  alt="usa"
                  width={20}
                  height={20}
                />
                <span className="block font-medium text-xs mb-[4px]">
                  Canada
                </span>
                <h6 className="!mb-0 !text-md !font-semibold">
                  2,500{" "}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    6.3%
                  </span>
                </h6>
              </div>
            </li>
            <li>
              <div className="relative border-t border-gray-100 dark:border-[#172036] mt-[14px] md:mt-[16px] ltr:pl-[30px] rtl:pr-[30px] pt-[14px] md:pt-[16px]">
                <Image
                  src="/images/flags/australia.svg"
                  className="absolute top-[18px] ltr:left-0 rtl:right-0 w-[20px]"
                  alt="usa"
                  width={20}
                  height={20}
                />
                <span className="block font-medium text-xs mb-[4px]">
                  Australia
                </span>
                <h6 className="!mb-0 !text-md !font-semibold">
                  2,200{" "}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    5.4%
                  </span>
                </h6>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default UsersByCountry;
