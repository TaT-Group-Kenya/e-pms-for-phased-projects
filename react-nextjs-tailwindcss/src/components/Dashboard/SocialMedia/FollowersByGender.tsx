"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const FollowersByGender: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [55, 45];

  const options: ApexOptions = {
    labels: ["Male Followers", "Female Followers"],
    colors: ["#605DFF", "#AD63F6"],
    legend: {
      show: false,
      fontSize: "12px",
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 8,
        vertical: 0,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 6,
        offsetX: -2,
        offsetY: -0.5,
        shape: "circle",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
    stroke: {
      width: 1,
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-[3px] md:!mb-0 !text-lg md:!text-[20px]">
              Followers by Gender
            </h5>
            <p>Understand your audience better!</p>
          </div>

          <Menu
            as="div"
            className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
          >
            <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[20px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
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

        <div className="trezo-card-content">
          <div className="text-center">
            <span className="block text-md text-black dark:text-white font-medium">
              54,500
            </span>
            <span className="block text-xs">Total Followers</span>
          </div>

          <div className="mt-[15px] mb-[13px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="pie"
                height={200}
                width={"100%"}
              />
            )}
          </div>

          <div className="flex justify-between">
            <div className="flex gap-[10px]">
              <div className="bg-primary-500 w-[10px] h-[10px] rounded-full"></div>
              <div>
                <span className="block font-medium text-black dark:text-white -mt-[5.3px]">
                  55%
                </span>
                <span className="block text-xs">Male Followers</span>
              </div>
            </div>

            <div className="flex gap-[10px]">
              <div className="bg-purple-500 w-[10px] h-[10px] rounded-full"></div>
              <div>
                <span className="block font-medium text-black dark:text-white -mt-[5.3px]">
                  45%
                </span>
                <span className="block text-xs">Female Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FollowersByGender;
