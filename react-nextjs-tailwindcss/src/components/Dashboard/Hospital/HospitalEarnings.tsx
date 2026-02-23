"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const HospitalEarnings: React.FC = () => {
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
      name: "Earnings",
      data: [3, 7, 7, 10, 9, 11, 20],
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
    colors: ["#3584FC"],
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    stroke: {
      curve: "straight",
      width: 1,
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
        show: false,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      // tickAmount: 6,
      show: false,
      // max: 150,
      // min: 0,
      labels: {
        formatter: (val) => {
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
        size: 7,
        offsetX: -2,
        offsetY: -0.5,
        shape: "diamond",
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-orange-50 dark:bg-[#16223e] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Hospital Earnings</h5>
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

        <div className="trezo-card-content">
          <div className="lg:grid lg:grid-cols-5 gap-[25px] items-center">
            <div className="lg:col-span-2">
              <div className="text-center lg:my-[8.5px] lg:ltr:-mr-[8px] lg:rtl:-ml-[8px]">
                <Image
                  className="inline-block"
                  src="/images/hospital.png"
                  alt="hospital-image"
                  width={280}
                  height={280}
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="md:ltr:pl-[15px] md:rtl:pr-[15px] mt-[20px] md:mt-[25px] lg:mt-0">
                <div className="sm:grid sm:grid-cols-2 gap-[15px] md:gap-[25px]">
                  <div className="bg-white dark:bg-[#0c1427] rounded-md py-[17.5px] px-[20px] md:px-[25px] mb-[15px] md:mb-[25px]">
                    <h3 className="!text-xl !font-medium !mb-[5px]">$120,000</h3>
                    <div className="flex items-center">
                      <span className="block">Total Profit</span>
                      <span className="relative font-medium inline-block ltr:ml-[8px] rtl:mr-[8px] text-xs ltr:pl-[15px] rtl:pr-[15px] text-danger-500">
                        <i className="ri-arrow-down-fill absolute text-base top-1/2 -translate-y-1/2 ltr:left-0 rtl:right-0"></i>
                        5%
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0c1427] rounded-md py-[17.5px] px-[20px] md:px-[25px] mb-[15px] md:mb-[25px]">
                    <h3 className="!text-xl !font-medium !mb-[5px]">$80,000</h3>
                    <div className="flex items-center">
                      <span className="block">Total Costs</span>
                      <span className="relative font-medium inline-block ltr:ml-[8px] rtl:mr-[8px] text-xs ltr:pl-[15px] rtl:pr-[15px] text-success-600">
                        <i className="ri-arrow-up-fill absolute text-base top-1/2 -translate-y-1/2 ltr:left-0 rtl:right-0"></i>
                        3%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0c1427] rounded-md relative p-[20px] md:p-[25px] mb-[15px]">
                  <h3 className="!font-medium !text-xl !mb-[5px]">
                    $900,000
                    <span className="relative inline-block -top-[4px] text-xs ltr:pl-[15px] rtl:pr-[15px] text-success-600">
                      <i className="ri-arrow-up-fill absolute text-base top-1/2 -translate-y-1/2 ltr:left-0 rtl:right-0"></i>
                      12%
                    </span>
                  </h3>

                  <span className="block">Total Earnings</span>

                  <div className="left-0 right-0 h-[15px] -bottom-[15px] opacity-[.65] absolute bg-white dark:bg-[#0c1427] mx-[25px] rounded-b-md"></div>

                  <div className="absolute top-1/2 -translate-y-1/2 ltr:right-[20px] rtl:left-[20px] max-w-[150px]">
                    {isChartLoaded && (
                      <Chart
                        options={options}
                        series={series}
                        type="area"
                        height={95}
                        width={"100%"}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalEarnings;
