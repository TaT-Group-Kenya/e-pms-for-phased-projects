"use client";

import React, { useState } from "react";
import Image from "next/image";
import WorldMap from "react-svg-worldmap";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface CountryData {
  country: string;
  value: number;
}

interface BranchRevenue {
  id: string;
  country: string;
  flag: string;
  percentage: number;
  color: {
    bg: string;
    bar: string;
  };
}

const RevenueByBranches: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // CountryData
  const data: CountryData[] = [
    { country: "us", value: 331883986 }, // United States
    { country: "de", value: 83129285 }, // Germany
    { country: "gb", value: 67886011 }, // United Kingdom
    { country: "ca", value: 38005238 }, // Canada
    { country: "pt", value: 10196709 }, // Portugal
    { country: "es", value: 47351567 }, // Spain
    { country: "fr", value: 65273511 }, // France
  ];

  // Branch revenue data
  const branches: BranchRevenue[] = [
    {
      id: "1",
      country: "Portugal",
      flag: "/images/flags/portugal.svg",
      percentage: 85,
      color: {
        bg: "bg-primary-100 dark:bg-[#172036]",
        bar: "bg-primary-400",
      },
    },
    {
      id: "2",
      country: "Germany",
      flag: "/images/flags/germany.svg",
      percentage: 65,
      color: {
        bg: "bg-secondary-100 dark:bg-[#172036]",
        bar: "bg-secondary-400",
      },
    },
    {
      id: "3",
      country: "Spain",
      flag: "/images/flags/spain.svg",
      percentage: 45,
      color: {
        bg: "bg-purple-100 dark:bg-[#172036]",
        bar: "bg-purple-400",
      },
    },
    {
      id: "4",
      country: "Canada",
      flag: "/images/flags/canada.svg",
      percentage: 75,
      color: {
        bg: "bg-success-100 dark:bg-[#172036]",
        bar: "bg-success-500",
      },
    },
    {
      id: "5",
      country: "USA",
      flag: "/images/flags/usa.svg",
      percentage: 20,
      color: {
        bg: "bg-danger-100 dark:bg-[#172036]",
        bar: "bg-danger-500",
      },
    },
  ];

  // Get performance rating
  const getPerformanceRating = (percentage: number) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Average";
    return "Needs Improvement";
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Revenue by Branches</h5>
          </div>
          <div className="trezo-card-subtitle">
            <Menu
              as="div"
              className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
            >
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[25px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-2-fill"></i>
              </MenuButton>

              <MenuItems className="transition-all bg-white shadow-3xl rounded-md py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in ">
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
          <div className="flex items-center justify-center min-h-[189px]">
            <WorldMap
              backgroundColor="transparent"
              color="blue"
              value-suffix="people"
              size="sm"
              data={data}
            />
          </div>

          <ul className="mt-[20px] md:mt-[25px]">
            {branches.map((branch) => (
              <li
                key={branch.id}
                className="flex items-center justify-between border-b first:border-t border-primary-50 dark:border-[#172036] py-[10px] md:py-[12px]"
              >
                <div className="flex items-center gap-[8px]">
                  <Image
                    src={branch.flag}
                    className="w-[24px]"
                    alt={branch.country}
                    width={24}
                    height={24}
                  />
                  <div>
                    <span className="font-medium">{branch.country}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      {getPerformanceRating(branch.percentage)}
                    </span>
                  </div>
                </div>
                <div className="w-[150px]">
                  <div className="leading-none flex items-center gap-[12px]">
                    <div
                      className={`flex w-full h-[5px] overflow-hidden rounded-md dark:bg-[#172036] ${branch.color.bg}`}
                    >
                      <div
                        className={`flex flex-col justify-center overflow-hidden rounded-md ${branch.color.bar}`}
                        style={{ width: `${branch.percentage}%` }}
                      />
                    </div>

                    <span className="block">{branch.percentage}%</span>
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

export default RevenueByBranches;
