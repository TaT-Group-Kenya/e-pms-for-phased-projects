"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LinkedInNetFollowers: React.FC = () => {
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

  const series = [
    {
      name: "Followers",
      data: [250, 150, 250, 120, 350, 150, 250],
    },
  ];

  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      dropShadow: {
        top: 5,
        left: 5,
        blur: 3,
        opacity: 0.9,
        enabled: true,
        color: "#605DFF",
        enabledOnSeries: [0],
      },
    },
    colors: ["#605DFF"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: [1],
    },
    grid: {
      borderColor: "#ECEEF2",
      strokeDashArray: 8,
    },
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.0,
      },
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisTicks: {
        show: false,
        color: "#64748B",
      },
      axisBorder: {
        show: true,
        color: "#D5D9E2",
      },
      labels: {
        show: true,
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      max: 400,
      min: 0,
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: true,
        color: "#D5D9E2",
      },
      axisTicks: {
        show: false,
        color: "#D5D9E2",
      },
    },
    legend: {
      show: true,
      position: "top",
      fontSize: "12px",
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
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header sm:mb-[15px] sm:flex items-center justify-between">
          <div className="trezo-card-title mb-[10px] sm:mb-0">
            <h5 className="!mb-[3px] md:!mb-0 !text-lg md:!text-[20px]">
              LinkedIn Net Followers
            </h5>
            <p>
              Net followers growth:{" "}
              <span className="text-primary-500">+275</span>
            </p>
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
          <ul className="sm:flex items-center gap-[25px] md:gap-[35px] lg:gap-[50px]">
            <li className="inline-block mt-[15px] sm:mt-0 ltr:mr-[15px] rtl:ml-[15px] ltr:sm:mr-0 rtl:sm:ml-0">
              <span className="block font-medium text-black dark:text-white">56,100</span>
              <span className="block mt-px text-xs">Starting Followers</span>
            </li>
            <li className="inline-block mt-[15px] sm:mt-0 ltr:mr-[15px] rtl:ml-[15px] ltr:sm:mr-0 rtl:sm:ml-0">
              <span className="block font-medium text-black dark:text-white">300</span>
              <span className="block mt-px text-xs">New Followers</span>
            </li>
            <li className="inline-block mt-[15px] sm:mt-0 ltr:mr-[15px] rtl:ml-[15px] ltr:sm:mr-0 rtl:sm:ml-0">
              <span className="block font-medium text-black dark:text-white">25</span>
              <span className="block mt-px text-xs">Unfollows</span>
            </li>
            <li className="inline-block mt-[15px] sm:mt-0 ltr:mr-[15px] rtl:ml-[15px] ltr:sm:mr-0 rtl:sm:ml-0">
              <span className="block font-medium text-black dark:text-white">56,375</span>
              <span className="block mt-px text-xs">Ending Followers</span>
            </li>
          </ul>

          <div className="-mb-[25px] ltr:-ml-[15px] rtl:-mr-[15px] ltr:-mr-[10px] rtl:ml-[10px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="area"
                height={297}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkedInNetFollowers;
