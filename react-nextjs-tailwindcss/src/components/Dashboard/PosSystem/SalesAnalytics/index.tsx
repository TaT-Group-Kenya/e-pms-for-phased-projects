"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import TopPerforming from "./TopPerforming";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesAnalytics: React.FC = () => {
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

  // Data for the chart
  const data = [70, 60, 80, 100, 70, 40, 80];
  const middleIndex = Math.floor(data.length / 2);

  const series = [
    {
      name: "Sale",
      data: data,
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: data.map((_, index) =>
      index === middleIndex ? "#605DFF" : "#C2CDFF"
    ),
    plotOptions: {
      bar: {
        columnWidth: "13px",
        borderRadius: 4,
        distributed: true,
        horizontal: false,
      },
    },
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
      show: false,
      labels: {
        formatter: (val: number) => {
          return "$" + val + "k";
        },
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
    tooltip: {
      y: {
        formatter: function (val: number) {
          return "$" + val + "k";
        },
      },
    },
    legend: {
      show: false,
      position: "top",
      fontSize: "12px",
      horizontalAlign: "left",
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
        shape: "square",
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-gray-50 dark:bg-[#0c1427] rounded-md border border-gray-100 dark:border-[#172036]">
        <div className="trezo-card-header py-[15px] px-[20px] md:px-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !text-md !font-medium">Sales Analytics</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all hover:text-primary-500">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className=" transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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

        <div className="trezo-card-content bg-white dark:bg-dark p-[20px] md:p-[25px] rounded-md border-t border-gray-100 dark:border-[#172036]">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-[25px]">
            <div>
              <div className="flex items-center gap-[10px]">
                <div className="flex items-center justify-center bg-primary-100 dark:bg-[#15203c] rounded-md w-[44px] h-[44px]">
                  <Image
                    src="/images/icons/chart.svg"
                    alt="chart"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <span className="block">Sales Over Time</span>
                  <h4 className="!mb-0 !font-semibold !mt-px">$120,000</h4>
                </div>
                <span className="px-[8px] py-[3px] inline-block bg-success-100 dark:bg-[#15203c] text-success-700 rounded-md ltr:ml-[5px] rtl:mr-[5px]">
                  +9.1%
                </span>
              </div>
              <p className="mt-[15px] md:mt-[20px] leading-[1.4] md:max-w-[400px]">
                Sales have shown a positive trend, with a significant increase
                of 9.1% over the previous month.
              </p>
            </div>

            <div className="-mt-[11px] -mb-[11px] lg:ltr:-ml-[35px] lg:rtl:-mr-[35px]">
              {isChartLoaded && (
                <Chart
                  options={options}
                  series={series}
                  type="bar"
                  height={200}
                  width={"100%"}
                />
              )}
            </div>
          </div>
        </div>

        <div className="trezo-card-content bg-white dark:bg-dark p-[20px] md:p-[25px] rounded-b-md border-t border-gray-100 dark:border-[#172036]">
          <div className="relative py-[15px] ltr:md:pl-[175px] rtl:md:pr-[175px]">
            <div className="md:absolute md:ltr:-left-[25px] md:rtl:-right-[25px] md:max-w-[200px] -mb-[40px] md:mb-0">
              <TopPerforming />
            </div>

            <h5 className="!font-medium !text-md !mb-[20px]">
              Sales by Category/Products{" "}
              <span className="text-gray-500 dark:text-gray-400 text-base">
                (Top Performing)
              </span>
            </h5>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[20px]">
              <div className="flex items-center gap-[10px]">
                <div className="flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-md bg-purple-100 text-purple-500 dark:bg-[#15203c]">
                  <i className="material-symbols-outlined">devices</i>
                </div>
                <div>
                  <span className="block mb-[2px]">Electronics</span>
                  <h4 className="!mb-0 !font-medium !text-[18px] sm:!text-[20px]">$35,000</h4>
                </div>
              </div>

              <div className="flex items-center gap-[10px]">
                <div className="flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-md bg-success-100 text-success-600 dark:bg-[#15203c]">
                  <i className="material-symbols-outlined">apparel</i>
                </div>
                <div>
                  <span className="block mb-[2px]">Clothing</span>
                  <h4 className="!mb-0 !font-medium !text-[18px] sm:!text-[20px]">$25,000</h4>
                </div>
              </div>

              <div className="flex items-center gap-[10px]">
                <div className="flex items-center justify-center shrink-0 w-[44px] h-[44px] rounded-md bg-secondary-100 text-secondary-500 dark:bg-[#15203c]">
                  <i className="material-symbols-outlined">deployed_code</i>
                </div>
                <div>
                  <span className="block mb-[2px]">Home Goods</span>
                  <h4 className="!mb-0 !font-medium !text-[18px] sm:!text-[20px]">$18,000</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesAnalytics;
