"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const FacebookCampaignOverview: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Week");

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
      name: "Impressions",
      type: "column",
      data: [400, 600, 200, 700, 480, 380, 600],
    },
    {
      name: "Clicks",
      type: "column",
      data: [500, 420, 520, 570, 300, 400, 180],
    },
    { name: "CTR", type: "column", data: [450, 400, 330, 300, 410, 530, 380] },
    {
      name: "Cost Per Conversion",
      type: "line",
      data: [480, 650, 500, 800, 550, 800, 900],
    },
  ];

  const options: ApexOptions = {
    chart: {
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ["#605DFF", "#37D80A", "#FD5812", "#BF85FB"],
    stroke: {
      width: [5, 5, 5, 2],
      curve: "smooth",
      colors: ["transparent", "transparent", "transparent", "#BF85FB"],
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 3,
      },
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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
      tickAmount: 5,
      max: 1000,
      min: 0,
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
        formatter: function (val) {
          return "$" + val;
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
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0);
          }
          return y;
        },
      },
    },
    legend: {
      show: false,
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
    grid: {
      show: true,
      borderColor: "#ECEEF2",
      strokeDashArray: 8,
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header sm:mb-[15px] md:mb-[22px] sm:flex items-center justify-between">
          <div className="trezo-card-title mb-[10px] sm:mb-0">
            <h5 className="!mb-[3px] md:!mb-0 !text-lg md:!text-[20px]">
              Facebook Campaign Overview
            </h5>
            <p>Track campaign success at a glance!</p>
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
          <span className="font-medium md:text-md relative ltr:pl-[22px] rtl:pr-[22px] text-black dark:text-white">
            <i className="ri-bookmark-line absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-danger-500 text-lg"></i>
            Summer Sale Boost
          </span>

          <div className="relative">
            <div className="ltr:-ml-[15px] rtl:-mr-[15px] -mb-[25px] mt-[5px] ltr:md:pr-[150px] rtl:md:pl-[150px]">
              {isChartLoaded && (
                <Chart
                  options={options}
                  series={series}
                  type="line"
                  height={297}
                  width={"100%"}
                />
              )}
            </div>

            <div className="mt-[20px] md:mt-0 md:absolute ltr:right-0 rtl:left-0 md:top-1/2 md:-translate-y-1/2">
              <div className="flex gap-[9px] mb-[20px] md:mb-[25px] last:mb-0">
                <div className="bg-primary-500 w-[10px] h-[10px] rounded-full"></div>
                <div>
                  <span className="block font-medium text-black dark:text-white -mt-[5.3px]">
                    45,000
                  </span>
                  <span className="block text-xs">Impressions</span>
                </div>
              </div>
              <div className="flex gap-[9px] mb-[20px] md:mb-[25px] last:mb-0">
                <div className="bg-success-500 w-[10px] h-[10px] rounded-full"></div>
                <div>
                  <span className="block font-medium text-black dark:text-white -mt-[5.3px]">
                    4,200
                  </span>
                  <span className="block text-xs">Clicks</span>
                </div>
              </div>
              <div className="flex gap-[9px] mb-[20px] md:mb-[25px] last:mb-0">
                <div className="bg-orange-500 w-[10px] h-[10px] rounded-full"></div>
                <div>
                  <span className="block font-medium text-black dark:text-white -mt-[5.3px]">
                    9.3%
                  </span>
                  <span className="block text-xs">CTR</span>
                </div>
              </div>
              <div className="flex gap-[9px] mb-[20px] md:mb-[25px] last:mb-0">
                <div className="bg-purple-500 w-[10px] h-[10px] rounded-full"></div>
                <div>
                  <span className="block font-medium text-black dark:text-white -mt-[5.3px]">
                    $5.50
                  </span>
                  <span className="block text-xs">Cost Per Conversion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacebookCampaignOverview;
