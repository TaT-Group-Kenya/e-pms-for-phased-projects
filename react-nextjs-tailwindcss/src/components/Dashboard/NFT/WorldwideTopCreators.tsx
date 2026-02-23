"use client";

import React, { useState } from "react";
import Image from "next/image";
import WorldMap from "react-svg-worldmap";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface MapData {
  country: string;
  value: number;
}

interface CountryData {
  country: string;
  value: number;
  flag: string;
  percentage: number;
  color: string;
}

const WorldwideTopCreators: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("This Day");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Country data
  const countryData: CountryData[] = [
    {
      country: "Portugal",
      value: 10196709,
      flag: "/images/flags/portugal.svg",
      percentage: 85,
      color: "bg-primary-400",
    },
    {
      country: "Germany",
      value: 83129285,
      flag: "/images/flags/germany.svg",
      percentage: 65,
      color: "bg-secondary-400",
    },
    {
      country: "Spain",
      value: 47351567,
      flag: "/images/flags/spain.svg",
      percentage: 45,
      color: "bg-purple-400",
    },
    {
      country: "Canada",
      value: 38005238,
      flag: "/images/flags/canada.svg",
      percentage: 75,
      color: "bg-success-500",
    },
  ];

  // Data for the WorldMap
  const mapData: MapData[] = [
    { country: "pt", value: 10196709 }, // Portugal
    { country: "de", value: 83129285 }, // Germany
    { country: "es", value: 47351567 }, // Spain
    { country: "ca", value: 38005238 }, // Canada
  ];

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
      <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
        <div className="trezo-card-title">
          <h5 className="!mb-0">Worldwide Top Creators</h5>
        </div>

        <div className="trezo-card-subtitle">
          <Menu as="div" className="trezo-card-dropdown relative">
            <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[26px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
              <i className="ri-more-fill"></i>
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
        <div className="flex items-center justify-center -my-[10px]">
          <WorldMap
            backgroundColor="transparent"
            color="blue"
            value-suffix="people"
            size="sm"
            data={mapData}
          />
        </div>

        <ul className="mt-[20px] md:mt-[24px]">
          {countryData.map((item) => (
            <li
              key={item.country}
              className="flex items-center justify-between border-b first:border-t border-primary-50 dark:border-[#172036] py-[10px] md:py-[12px]"
            >
              <div className="flex items-center gap-[8px]">
                <Image
                  src={item.flag}
                  className="w-[24px]"
                  alt={item.country}
                  width={24}
                  height={24}
                />
                <span className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">
                  {item.country}
                </span>
              </div>
              <div className="w-[140px]">
                <div className="leading-none flex items-center gap-[10px]">
                  <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-100 dark:bg-[#172036]">
                    <div
                      className={`flex flex-col justify-center overflow-hidden rounded-md ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="block text-[13px] font-medium">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorldwideTopCreators;
