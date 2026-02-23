"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import WorldMap from "react-svg-worldmap";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface WorldMapData {
  country: string;
  value: number;
}

const data: WorldMapData[] = [
  { country: "us", value: 331883986 }, // United States
  { country: "de", value: 83129285 }, // Germany
  { country: "gb", value: 67886011 }, // United Kingdom
  { country: "ca", value: 38005238 }, // Canada
  { country: "pt", value: 10196709 }, // Portugal
  { country: "es", value: 47351567 }, // Spain
  { country: "fr", value: 65273511 }, // France
];

interface CountryData {
  name: string;
  flag: string;
  percentage: number;
}

const PropertiesByCountry: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  const [countries, setCountries] = useState<CountryData[]>([]);

  // Example: Fetch data from an API or define static data
  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      // Replace this with your actual API endpoint
      const data: CountryData[] = [
        {
          name: "Portugal",
          flag: "/images/flags/portugal.svg",
          percentage: 85,
        },
        {
          name: "Germany",
          flag: "/images/flags/germany.svg",
          percentage: 65,
        },
        {
          name: "Spain",
          flag: "/images/flags/spain.svg",
          percentage: 45,
        },
        {
          name: "Canada",
          flag: "/images/flags/canada.svg",
          percentage: 75,
        },
      ];
      setCountries(data);
    };

    fetchData();
  }, []);

  // Function to determine progress bar colors based on percentage
  const getProgressBarColors = (percentage: number) => {
    if (percentage >= 80) {
      return {
        bgColor: "bg-green-100",
        progressColor: "bg-green-500",
      };
    } else if (percentage >= 60) {
      return {
        bgColor: "bg-blue-100",
        progressColor: "bg-blue-500",
      };
    } else if (percentage >= 40) {
      return {
        bgColor: "bg-yellow-100",
        progressColor: "bg-yellow-500",
      };
    } else {
      return {
        bgColor: "bg-red-100",
        progressColor: "bg-red-500",
      };
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Properties by Country</h5>
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
          <div className="flex items-center justify-center -m-[10px] -mb-[10px]">
            <WorldMap
              backgroundColor="transparent"
              color="blue"
              value-suffix="people"
              size="sm"
              data={data}
            />
          </div>

          <ul className="mt-[20px] md:mt-[25px]">
            {countries.map((country, index) => {
              const { bgColor, progressColor } = getProgressBarColors(
                country.percentage
              );
              return (
                <li
                  key={index}
                  className="flex items-center justify-between border-b first:border-t border-primary-50 dark:border-[#172036] py-[10px] md:py-[12px]"
                >
                  <div className="flex items-center gap-[8px]">
                    <Image
                      src={country.flag}
                      className="w-[24px]"
                      alt={country.name.toLowerCase()}
                      width={24}
                      height={24}
                    />
                    <span className="block font-medium">{country.name}</span>
                  </div>
                  <div className="w-[150px]">
                    <div className="leading-none flex items-center gap-[12px]">
                      <div
                        className={`flex w-full h-[5px] overflow-hidden rounded-md ${bgColor} dark:bg-[#172036]`}
                      >
                        <div
                          className={`flex flex-col justify-center overflow-hidden ${progressColor} rounded-md`}
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                      <span className="block">{country.percentage}%</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PropertiesByCountry;
