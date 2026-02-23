"use client";

import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const GuestActivity: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Daily");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`);
  };

  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    { name: "Check In", data: [15, 30, 20, 40, 35, 30, 25] },
    { name: "Check Out", data: [10, 20, 15, 25, 30, 40, 30] },
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
    colors: ["#ffffff", "#D8FFC8"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: [2, 2, 0],
      dashArray: [0, 6, 0],
    },
    grid: {
      show: true,
      borderColor: "#ffffff1a",
    },
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.2,
      },
    },
    xaxis: {
      categories: [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
      ],
      axisTicks: {
        show: false,
        color: "#ffffff1a",
      },
      axisBorder: {
        show: false,
        color: "#ffffff1a",
      },
      labels: {
        show: true,
        style: {
          colors: "#B1BBC8",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      // max: 100,
      min: 0,
      labels: {
        style: {
          colors: "#B1BBC8",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: true,
        color: "#ffffff1a",
      },
      axisTicks: {
        show: false,
        color: "#ffffff1a",
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
      <div className="trezo-card bg-secondary-600 p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !text-white">Guest Activity</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md bg-[#ffffff1a] text-white py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-secondary-500">
                <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                  {selectedOption}
                  <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                </span>
              </MenuButton>

              <MenuItems
                transition
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {["Daily", "Weekly", "Monthly", "Yearly"].map((option) => (
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
          <div className="-mt-[20px] -mb-[20px] ltr:-ml-[12px] rtl:-mr-[12px] ltr:-mr-[20px] rtl:-ml-[20px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="area"
                height={284}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestActivity;
