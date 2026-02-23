"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AgentAvgEarnings: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Day");

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
      name: "Earnings",
      data: [20, 40, 60, 60, 50, 30, 40, 30, 40, 40, 60, 60],
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
    },
    colors: ["#9135E8"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "stepline", //curve: ['straight', 'smooth', 'monotoneCubic', 'stepline']
      width: 3,
      lineCap: "round",
    },
    grid: {
      borderColor: "#ECF0FF",
      strokeDashArray: 10,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0,
        opacityTo: 0.8,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      labels: {
        show: false,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      show: false,
      max: 80,
      min: 0,
      labels: {
        formatter: (val) => {
          return "$" + val + "K";
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
        shape: "circle",
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Agent Avg. Earnings</h5>
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
          <div className="flex items-center gap-[30px]">
            <button
              type="button"
              className="inline-block rounded-[4px] transition-all bg-primary-500 text-white w-[34px] h-[28px]"
            >
              1d
            </button>
            <button
              type="button"
              className="inline-block rounded-[4px] transition-all hover:bg-primary-500 hover:text-white w-[34px] h-[28px]"
            >
              15d
            </button>
            <button
              type="button"
              className="inline-block rounded-[4px] transition-all hover:bg-primary-500 hover:text-white w-[34px] h-[28px]"
            >
              1m
            </button>
            <button
              type="button"
              className="inline-block rounded-[4px] transition-all hover:bg-primary-500 hover:text-white w-[34px] h-[28px]"
            >
              6m
            </button>
            <button
              type="button"
              className="inline-block rounded-[4px] transition-all hover:bg-primary-500 hover:text-white w-[34px] h-[28px]"
            >
              1y
            </button>
          </div>

          <div className="-mb-[3px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="area"
                height={275}
                width={"100%"}
              />
            )}
          </div>

          <div className="flex items-center gap-[30px]">
            <div className="flex items-center gap-[15px]">
              <div className="border border-gray-100 bg-gray-50 w-[48px] h-[48px] rounded-[5px] flex items-center justify-center dark:bg-[#0a0e19] dark:border-[#172036]">
                <Image
                  src="/images/icons/money.svg"
                  alt="money"
                  width={26}
                  height={26}
                />
              </div>
              <div>
                <h5 className="!mb-px !text-2xl !leading-none !font-semibold">
                  $2,534
                </h5>
                <span className="block">Last month earning</span>
              </div>
            </div>
            <span className="inline-block font-medium text-black dark:text-white relative ltr:pl-[27px] rtl:pr-[27px]">
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 text-success-600 !text-[20px]">
                trending_up
              </i>
              +8.7%
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentAvgEarnings;
