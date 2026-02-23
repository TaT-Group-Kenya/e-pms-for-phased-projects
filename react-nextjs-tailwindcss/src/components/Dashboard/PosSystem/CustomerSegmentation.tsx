"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CustomerSegmentation: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [1200, 1800];

  const options: ApexOptions = {
    labels: ["New", "Returning"],
    colors: ["#3584FC", "#AD63F6"],
    stroke: {
      width: 0,
      show: true,
      colors: ["#ffffff"],
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
        size: 7,
        offsetX: -2,
        offsetY: -0.5,
        shape: "diamond",
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "80%",
          labels: {
            show: true,
            name: {
              color: "#64748B",
            },
            value: {
              show: true,
              color: "#3A4252",
              fontSize: "24px",
              fontWeight: "600",
            },
            total: {
              show: true,
              color: "#64748B",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
  };

  return (
    <>
      <div className="trezo-card bg-gray-50 dark:bg-[#0c1427] rounded-md border border-gray-100 dark:border-[#172036]">
        <div className="trezo-card-header py-[15px] px-[20px] md:px-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !text-md !font-medium">Customer Segmentation</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu
              as="div"
              className="trezo-card-dropdown relative ltr:-mr-[7px] rtl:-ml-[7px]"
            >
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-[22px] text-gray-500 dark:text-gray-400 leading-none hover:text-primary-500">
                <i className="ri-more-2-fill"></i>
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
          <div className="lg:mb-[20px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="donut"
                height={210}
                width={"100%"}
              />
            )}
          </div>

          <div className="flex items-center gap-[10px] mb-[20px] md:mb-[25px] last:mb-0">
            <div className="flex items-center justify-center bg-secondary-100 text-secondary-500 dark:bg-[#15203c] rounded-md w-[44px] h-[44px]">
              <i className="material-symbols-outlined">person_add</i>
            </div>
            <div>
              <span className="block mb-[3px]">New Customers</span>
              <h4 className="!mb-0 !font-semibold !text-[20px] !flex !items-center !gap-[6px]">
                1,200{" "}
                <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                  +40% of total transactions
                </span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-[10px] mb-[20px] md:mb-[25px] last:mb-0">
            <div className="flex items-center justify-center bg-purple-100 text-purple-500 dark:bg-[#15203c] rounded-md w-[44px] h-[44px]">
              <i className="material-symbols-outlined">account_circle</i>
            </div>
            <div>
              <span className="block mb-[3px]">Returning Customers</span>
              <h4 className="!mb-0 !font-semibold !text-[20px] !flex !items-center !gap-[6px]">
                1,800{" "}
                <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                  +60% of total transactions
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerSegmentation;
