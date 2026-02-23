"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const BedOccupancyRate: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Today");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [1275, 825, 450];

  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false,
      },
    },
    labels: ["Total Beds", "Occupied Beds", "Available Beds"],
    colors: ["#1F64F1", "#BF85FB", "#37D80A"],
    stroke: {
      width: 1,
      show: true,
      colors: ["#ffffff"],
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
            name: {
              color: "#64748B",
            },
            value: {
              show: true,
              color: "#3A4252",
              fontSize: "22px",
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
      enabled: true,
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
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Bed Occupancy Rate</h5>
            <p className="mt-px">Currently occupied vs. available</p>
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
                {["Today", "Last Week", "Last Month", "Last Year"].map(
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
          <div className="lg:grid lg:grid-cols-2 gap-[25px] items-center">
            <div>
              <ul>
                <li className="flex items-center mb-[20px] md:mb-[25px] last:mb-0">
                  <div className="flex items-center justify-center rounded-md bg-secondary-100 dark:bg-[#15203c] text-secondary-500 w-[42px] h-[42px] ltr:mr-[10px] rtl:ml-[10px]">
                    <i className="material-symbols-outlined">airplay</i>
                  </div>
                  <div>
                    <h3 className="!text-lg !mb-px">1,275</h3>
                    <span className="block">Total Beds</span>
                  </div>
                </li>

                <li className="flex items-center mb-[20px] md:mb-[25px] last:mb-0">
                  <div className="flex items-center justify-center rounded-md bg-purple-100 dark:bg-[#15203c] text-purple-500 w-[42px] h-[42px] ltr:mr-[10px] rtl:ml-[10px]">
                    <i className="material-symbols-outlined">bed</i>
                  </div>
                  <div>
                    <h3 className="!text-lg !mb-px">825</h3>
                    <span className="block">Occupied Beds</span>
                  </div>
                </li>

                <li className="flex items-center mb-[20px] md:mb-[25px] last:mb-0">
                  <div className="flex items-center justify-center rounded-md bg-success-100 dark:bg-[#15203c] text-success-500 w-[42px] h-[42px] ltr:mr-[10px] rtl:ml-[10px]">
                    <i className="material-symbols-outlined">
                      featured_seasonal_and_gifts
                    </i>
                  </div>
                  <div>
                    <h3 className="!text-lg !mb-px">450</h3>
                    <span className="block">Available Beds</span>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-center mt-[20px] md:mt-0">
                {isChartLoaded && (
                  <Chart
                    options={options}
                    series={series}
                    type="donut"
                    height={142}
                    width={"100%"}
                  />
                )}

                <p className="text-xs mx-auto leading-[1.6] max-w-[189px]">
                  The donut or pie chart representing the occupancy rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BedOccupancyRate;
