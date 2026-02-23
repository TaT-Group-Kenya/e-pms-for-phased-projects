"use client";

import React, { useState } from "react";
import Image from "next/image";
import WorldMap from "react-svg-worldmap";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface CountryData {
  country: string;
  value: number;
}

const CallCenterGeography: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last Year");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Country data
  const data: CountryData[] = [
    { country: "us", value: 331883986 }, // United States
    { country: "de", value: 83129285 }, // Germany
    { country: "gb", value: 67886011 }, // United Kingdom
    { country: "ca", value: 38005238 }, // Canada
    { country: "pt", value: 10196709 }, // Portugal
    { country: "es", value: 47351567 }, // Spain
    { country: "fr", value: 65273511 }, // France
  ];

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Call Center Geography</h5>
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
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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
          <div className="flex items-center justify-center my-[30px]">
            <WorldMap
              backgroundColor="transparent"
              color="blue"
              value-suffix="people"
              size="sm"
              data={data}
            />
          </div>

          <ul className="mt-[20px]">
            <li className="flex items-center mb-[20px] last:mb-0">
              <div className="shrink-0 ltr:mr-[15px] rtl:ml-[15px]">
                <Image
                  src="/images/flags/usa.svg"
                  className="inline-block"
                  alt="usa"
                  width={30}
                  height={30}
                />
              </div>
              <div className="grow">
                <div className="flex items-center justify-between mb-[5px] relative">
                  <span className="block font-medium">United States</span>
                  <span className="block font-medium absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    1,200 calls
                  </span>
                  <span className="block font-medium">90%</span>
                </div>
                <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                  <div
                    className="flex flex-col justify-center overflow-hidden bg-success-500 rounded-md"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
            </li>
            <li className="flex items-center mb-[20px] last:mb-0">
              <div className="shrink-0 ltr:mr-[15px] rtl:ml-[15px]">
                <Image
                  src="/images/flags/canada.svg"
                  className="inline-block"
                  alt="canada"
                  width={30}
                  height={30}
                />
              </div>
              <div className="grow">
                <div className="flex items-center justify-between mb-[5px] relative">
                  <span className="block font-medium">Canada</span>
                  <span className="block font-medium absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    980 calls
                  </span>
                  <span className="block font-medium">88%</span>
                </div>
                <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                  <div
                    className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                    style={{ width: "88%" }}
                  ></div>
                </div>
              </div>
            </li>
            <li className="flex items-center mb-[20px] last:mb-0">
              <div className="shrink-0 ltr:mr-[15px] rtl:ml-[15px]">
                <Image
                  src="/images/flags/brazil.svg"
                  className="inline-block"
                  alt="brazil"
                  width={30}
                  height={30}
                />
              </div>
              <div className="grow">
                <div className="flex items-center justify-between mb-[5px] relative">
                  <span className="block font-medium">Brazil</span>
                  <span className="block font-medium absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    850 calls
                  </span>
                  <span className="block font-medium">65%</span>
                </div>
                <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                  <div
                    className="flex flex-col justify-center overflow-hidden bg-orange-500 rounded-md"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default CallCenterGeography;
