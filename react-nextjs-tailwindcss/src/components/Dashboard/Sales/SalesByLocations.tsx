"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import WorldMap from "react-svg-worldmap";

interface CountryData {
  country: string;
  value: number;
}

interface LocationData {
  country: string;
  flag: string;
  orders: number;
  earnings: string;
}

const SalesByLocations: React.FC = () => {
  const data: CountryData[] = [
    { country: "us", value: 331883986 }, // United States
    { country: "de", value: 83129285 }, // Germany
    { country: "gb", value: 67886011 }, // United Kingdom
    { country: "ca", value: 38005238 }, // Canada
    { country: "pt", value: 10196709 }, // Portugal
    { country: "es", value: 47351567 }, // Spain
    { country: "fr", value: 65273511 }, // France
  ];

  const [selectedOption, setSelectedOption] = useState<string>("Monthly");
  const [locationsData, setLocationsData] = useState<LocationData[]>([]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  useEffect(() => {
    // Simulate fetching data
    const fetchData = () => {
      const data: LocationData[] = [
        {
          country: "USA",
          flag: "/images/flags/usa.svg",
          orders: 22124,
          earnings: "$250.4k",
        },
        {
          country: "Germany",
          flag: "/images/flags/germany.svg",
          orders: 18320,
          earnings: "$180.3k",
        },
        {
          country: "UK",
          flag: "/images/flags/uk.svg",
          orders: 12560,
          earnings: "$125.6k",
        },
        {
          country: "Canada",
          flag: "/images/flags/canada.svg",
          orders: 8720,
          earnings: "$94.1k",
        },
      ];
      setLocationsData(data);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="trezo-card border border-gray-100 dark:border-[#172036] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Sales by Locations</h5>
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

        <div className="trezo-card-content">
          <div className="flex items-center justify-center -my-[15px]">
            <WorldMap
              backgroundColor="transparent"
              color="blue"
              value-suffix="people"
              size="sm"
              data={data}
            />
          </div>

          <div className="table-responsive overflow-x-auto mt-[9px] without-border">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="font-medium text-xs ltr:text-left rtl:text-right px-[14px] pb-[8px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Country
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[8px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Orders
                  </th>
                  <th className="font-medium text-xs ltr:text-right rtl:text-left px-[14px] pb-[8px] whitespace-nowrap ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0">
                    Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="text-black dark:text-white">
                {locationsData.map((location, index) => (
                  <tr key={index}>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[11px] border-b border-gray-100 dark:border-[#172036]">
                      <div className="flex items-center">
                        <div className="w-[22px]">
                          <Image
                            alt={location.country}
                            src={location.flag}
                            width={22}
                            height={22}
                          />
                        </div>
                        <span className="block font-medium ltr:ml-[10px] rtl:mr-[10px]">
                          {location.country}
                        </span>
                      </div>
                    </td>
                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[11px] border-b border-gray-100 dark:border-[#172036]">
                      {location.orders.toLocaleString()}
                    </td>
                    <td className="font-medium ltr:text-right rtl:text-left whitespace-nowrap px-[14px] ltr:first:pl-0 rtl:first:pr-0 ltr:last:pr-0 rtl:last:pl-0 py-[11px] border-b border-gray-100 dark:border-[#172036]">
                      {location.earnings}
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

export default SalesByLocations;
