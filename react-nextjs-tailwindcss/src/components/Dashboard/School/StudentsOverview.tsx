"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StudentsOverview: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last Month");

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
      name: "Boys",
      data: [70, 42, 70, 120, 40, 70, 90],
    },
    {
      name: "Girls",
      data: [-70, -44, -70, -120, -40, -70, -90],
    },
  ];

  const options: ApexOptions = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ["#3584FC", "#FD5812"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "12px",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 7,
      borderColor: "#ECEEF2",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    legend: {
      show: true,
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
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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
        formatter: function (value) {
          return `${Math.abs(value).toFixed(2)}`; // Format the value as a string with two decimal places
        },
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Students Overview</h5>
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
          <div className="ltr:-ml-[10px] rtl:-mr-[10px] md:mb-[10px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={303}
                width={"100%"}
              />
            )}
          </div>
          <div className="flex items-center gap-[20px] 2xl:gap-[30px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center justify-center bg-primary-100 dark:bg-[#15203c] rounded-[4px] w-[42px] h-[42px]">
                <Image
                  src="/images/icons/boys.svg"
                  alt="boys"
                  width={30}
                  height={30}
                />
              </div>
              <div>
                <span className="block">Boys</span>
                <h5 className="!mb-0 !mt-px !text-[20px] !font-semibold">980</h5>
              </div>
            </div>
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center justify-center bg-orange-100 dark:bg-[#15203c] rounded-[4px] w-[42px] h-[42px]">
                <Image
                  src="/images/icons/girls.svg"
                  alt="girls"
                  width={30}
                  height={30}
                />
              </div>
              <div>
                <span className="block">Girls</span>
                <h5 className="!mb-0 !mt-px !text-[20px] !font-semibold">675</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentsOverview;
