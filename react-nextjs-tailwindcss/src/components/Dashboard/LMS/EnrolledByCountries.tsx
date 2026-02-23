"use client";

import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import WorldMap from "react-svg-worldmap";

const data = [
  { country: "cn", value: 1389618778 }, // china
  { country: "in", value: 1311559204 }, // india
  { country: "us", value: 331883986 }, // united states
  { country: "id", value: 264935824 }, // indonesia
  { country: "pk", value: 210797836 }, // pakistan
  { country: "br", value: 210301591 }, // brazil
  { country: "ng", value: 208679114 }, // nigeria
  { country: "bd", value: 161062905 }, // bangladesh
  { country: "ru", value: 141944641 }, // russia
  { country: "mx", value: 127318112 }, // mexico
  { country: "jp", value: 125960000 }, // Japan
  { country: "au", value: 25687041 }, // Australia
  { country: "de", value: 83129285 }, // Germany
];

type Country = {
  name: string;
  flag: string;
  enrollmentPercentage: number;
};

const initialCountries: Country[] = [
  {
    name: "United States",
    flag: "/images/flags/usa.svg",
    enrollmentPercentage: 85,
  },
  {
    name: "Germany",
    flag: "/images/flags/germany.svg",
    enrollmentPercentage: 75,
  },
  {
    name: "United Kingdom",
    flag: "/images/flags/uk.svg",
    enrollmentPercentage: 40,
  },
  {
    name: "Canada",
    flag: "/images/flags/canada.svg",
    enrollmentPercentage: 10,
  },
];

const EnrolledByCountries: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Last 6 Months");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected time period: ${option}`);
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Enrolled by Countries</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-fill"></i>
              </MenuButton>

              <MenuItems
                transition
                className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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
          <div className="flex items-center justify-center -my-[10px]">
            <WorldMap
              backgroundColor="transparent"
              color="blue"
              value-suffix="people"
              size="sm"
              data={data}
            />
          </div>

          <ul className="mt-[24px]">
            {initialCountries.map((country) => (
              <li
                key={country.name}
                className="flex items-center mb-[15px] last:mb-0"
              >
                <div className="shrink-0 ltr:mr-[15px] rtl:ml-[15px]">
                  <Image
                    src={country.flag}
                    alt={country.name}
                    className="inline-block"
                    width={30}
                    height={30}
                  />
                </div>
                <div className="grow">
                  <span className="block font-medium mb-[2px]">
                    {country.name}
                  </span>
                  <div className="leading-none flex items-center">
                    <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                      <div
                        className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                        style={{ width: `${country.enrollmentPercentage}%` }}
                      ></div>
                    </div>
                    <span className="block ltr:ml-[15px] rtl:mr-[15px]">
                      {country.enrollmentPercentage}%
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default EnrolledByCountries;
