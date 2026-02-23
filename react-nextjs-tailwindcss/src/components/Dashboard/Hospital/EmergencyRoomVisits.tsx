"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const EmergencyRoomVisits: React.FC = () => {
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

  // Utility function to generate random data
  const generateData = (count: number, range: { min: number; max: number }) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
      );
    }
    return data;
  };

  const series = [
    {
      name: "14 PM",
      data: generateData(14, { min: 0, max: 90 }),
    },
    {
      name: "13 PM",
      data: generateData(14, { min: 0, max: 90 }),
    },
    {
      name: "12 PM",
      data: generateData(14, { min: 0, max: 90 }),
    },
    {
      name: "11 AM",
      data: generateData(14, { min: 0, max: 90 }),
    },
    {
      name: "10 AM",
      data: generateData(14, { min: 0, max: 90 }),
    },
    {
      name: "9 AM",
      data: generateData(14, { min: 0, max: 90 }),
    },
    {
      name: "8 AM",
      data: generateData(14, { min: 0, max: 90 }),
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#605DFF"],
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    xaxis: {
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      labels: {
        show: true,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Emergency Room Visits</h5>
            <p className="mt-px">ER based on patient visits</p>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-gray-100 py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-gray-50 dark:border-[#172036] dark:hover:bg-[#0a0e19]">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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
          <div className="-mt-[30px] ltr:-ml-[15px] rtl:-mr-[15px] -mb-[25px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="heatmap"
                height={225}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmergencyRoomVisits;