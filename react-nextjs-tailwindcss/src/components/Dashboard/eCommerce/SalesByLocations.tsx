"use client";

import React, { useState } from "react";
import Image from "next/image";
import WorldMap from "react-svg-worldmap";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface CountryData {
  country: string;
  value: number;
}

type Location = {
  name: string;
  flag: string;
  percentage: number;
};

const data: CountryData[] = [
  { country: "us", value: 331883986 }, // United States
  { country: "de", value: 83129285 }, // Germany
  { country: "gb", value: 67886011 }, // United Kingdom
  { country: "ca", value: 38005238 }, // Canada
  { country: "pt", value: 10196709 }, // Portugal
  { country: "es", value: 47351567 }, // Spain
  { country: "fr", value: 65273511 }, // France
];

const locations: Location[] = [
  { name: "United States", flag: "/images/flags/usa.svg", percentage: 85 },
  { name: "Germany", flag: "/images/flags/germany.svg", percentage: 75 },
  { name: "United Kingdom", flag: "/images/flags/uk.svg", percentage: 40 },
  { name: "Canada", flag: "/images/flags/canada.svg", percentage: 10 },
  { name: "Portugal", flag: "/images/flags/portugal.svg", percentage: 5 },
  { name: "Spain", flag: "/images/flags/spain.svg", percentage: 15 },
];

const SalesByLocations: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Sales by Locations</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-fill"></i>
              </MenuButton>

              <MenuItems className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
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
          <div className="flex items-center justify-center -m-[16px] -mb-[-16px]">
            <WorldMap
              backgroundColor="transparent"
              color="blue"
              value-suffix="people"
              size="sm"
              data={data}
            />
          </div>

          <ul className="mt-[20px]">
            {locations.map((location) => (
              <li
                className="flex items-center mb-[15px] last:mb-0"
                key={location.name}
              >
                <div className="shrink-0 ltr:mr-[15px] rtl:ml-[15px]">
                  <Image
                    src={location.flag}
                    className="inline-block"
                    alt={location.name}
                    width={30}
                    height={30}
                  />
                </div>
                <div className="grow">
                  <span className="block font-medium mb-[2px]">
                    {location.name}
                  </span>
                  <div className="leading-none flex items-center">
                    <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                      <div
                        className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                        style={{ width: `${location.percentage}%` }}
                      ></div>
                    </div>
                    <span className="block ltr:ml-[15px] rtl:mr-[15px]">
                      {location.percentage}%
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

export default SalesByLocations;
