"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import WorldMap from "react-svg-worldmap";

interface CountryData {
  country: string;
  value: number;
}

interface SalesData {
  country: string;
  flag: string;
  salesPercentage: number;
}

// Sample data fetching function (replace with actual API call)
const fetchSalesData = (): Promise<SalesData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          country: "United States",
          flag: "/images/flags/usa.svg",
          salesPercentage: 85,
        },
        {
          country: "Germany",
          flag: "/images/flags/germany.svg",
          salesPercentage: 75,
        },
        {
          country: "United Kingdom",
          flag: "/images/flags/uk.svg",
          salesPercentage: 40,
        },
        {
          country: "Canada",
          flag: "/images/flags/canada.svg",
          salesPercentage: 10,
        },
        {
          country: "Portugal",
          flag: "/images/flags/portugal.svg",
          salesPercentage: 5,
        },
        {
          country: "Spain",
          flag: "/images/flags/spain.svg",
          salesPercentage: 15,
        },
        {
          country: "France",
          flag: "/images/flags/france.svg",
          salesPercentage: 25,
        },
      ]);
    }, 1000); // Simulate an API call with a delay of 1 second
  });
};

const MostSalesLocation: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Day");
  const [salesData, setSalesData] = useState<SalesData[]>([]);

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

  // Fetch the sales data on component mount
  useEffect(() => {
    const loadSalesData = async () => {
      const data = await fetchSalesData();
      setSalesData(data);
    };
    loadSalesData();
  }, []);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Most Sales Location</h5>
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
          <div className="flex items-center justify-center ">
            <WorldMap
              backgroundColor="transparent"
              color="blue"
              value-suffix="people"
              size="sm"
              data={data}
            />
          </div>

          <ul className="mt-[20px]">
            {salesData.map((data, index) => (
              <li key={index} className="flex items-center mb-[15px] last:mb-0">
                <div className="shrink-0 ltr:mr-[15px] rtl:ml-[15px]">
                  <Image
                    src={data.flag}
                    className="inline-block"
                    alt={data.country}
                    width={30}
                    height={30}
                  />
                </div>
                <div className="grow">
                  <span className="block font-medium mb-[2px]">
                    {data.country}
                  </span>
                  <div className="leading-none flex items-center">
                    <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                      <div
                        className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                        style={{ width: `${data.salesPercentage}%` }}
                      ></div>
                    </div>
                    <span className="block ltr:ml-[15px] rtl:mr-[15px]">
                      {data.salesPercentage}%
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

export default MostSalesLocation;