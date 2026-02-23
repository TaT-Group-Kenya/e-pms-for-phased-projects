"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import WorldMap from "react-svg-worldmap";

interface CountryData {
  country: string;
  value: number;
}

const SalesByCountry: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // CountryData
  const data: CountryData[] = [
    { country: "pt", value: 10196709 }, // Portugal
    { country: "de", value: 83129285 }, // Germany
    { country: "es", value: 47351567 }, // Spain
    { country: "ca", value: 38005238 }, // Canada
  ];

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Sales By Country</h5>
          </div>
          <div className="trezo-card-subtitle">
            <div className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]">
              <Menu as="div" className="trezo-card-dropdown relative">
                <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[22px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                  <i className="ri-more-2-fill"></i>
                </MenuButton>

                <MenuItems
                  transition
                  className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {["Weekly", "Monthly", "Yearly"].map((option) => (
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
        </div>

        <div className="trezo-card-content">
          <div className="flex items-center justify-center -my-[10px]">
            <WorldMap
              backgroundColor="transparent"
              color="blue"
              value-suffix="people"
              size="sm"
              data={data}
            />
          </div>

          <ul className="mt-[20px] md:mt-[24px]">
            <li className="flex items-center justify-between border-b first:border-t border-primary-50 dark:border-[#172036] py-[10px] md:py-[12px]">
              <div className="flex items-center gap-[8px]">
                <Image
                  src="/images/flags/portugal.svg"
                  alt="portugal"
                  width={24}
                  height={24}
                />
                <span className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">
                  Portugal
                </span>
              </div>
              <div className="w-[140px]">
                <div className="leading-none flex items-center gap-[10px]">
                  <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-100 dark:bg-[#172036]">
                    <div
                      className="flex flex-col justify-center overflow-hidden bg-primary-400 rounded-md"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                  <span className="block text-[13px] font-medium">85%</span>
                </div>
              </div>
            </li>

            <li className="flex items-center justify-between border-b first:border-t border-primary-50 dark:border-[#172036] py-[10px] md:py-[12px]">
              <div className="flex items-center gap-[8px]">
                <Image
                  src="/images/flags/germany.svg"
                  alt="germany"
                  width={24}
                  height={24}
                />
                <span className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">
                  Germany
                </span>
              </div>
              <div className="w-[140px]">
                <div className="leading-none flex items-center gap-[10px]">
                  <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-secondary-100 dark:bg-[#172036]">
                    <div
                      className="flex flex-col justify-center overflow-hidden bg-secondary-400 rounded-md"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <span className="block text-[13px] font-medium">65%</span>
                </div>
              </div>
            </li>

            <li className="flex items-center justify-between border-b first:border-t border-primary-50 dark:border-[#172036] py-[10px] md:py-[12px]">
              <div className="flex items-center gap-[8px]">
                <Image
                  src="/images/flags/spain.svg"
                  alt="spain"
                  width={24}
                  height={24}
                />
                <span className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">
                  Spain
                </span>
              </div>
              <div className="w-[140px]">
                <div className="leading-none flex items-center gap-[10px]">
                  <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-purple-100 dark:bg-[#172036]">
                    <div
                      className="flex flex-col justify-center overflow-hidden bg-purple-400 rounded-md"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                  <span className="block text-[13px] font-medium">45%</span>
                </div>
              </div>
            </li>

            <li className="flex items-center justify-between border-b first:border-t border-primary-50 dark:border-[#172036] py-[10px] md:py-[12px]">
              <div className="flex items-center gap-[8px]">
                <Image
                  src="/images/flags/canada.svg"
                  alt="canada"
                  width={24}
                  height={24}
                />
                <span className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">
                  Canada
                </span>
              </div>
              <div className="w-[140px]">
                <div className="leading-none flex items-center gap-[10px]">
                  <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-success-100 dark:bg-[#172036]">
                    <div
                      className="flex flex-col justify-center overflow-hidden bg-success-500 rounded-md"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <span className="block text-[13px] font-medium">75%</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SalesByCountry;
