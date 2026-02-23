"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CustomerSatisfaction: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("This Month");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [50, 15, 75, 50];

  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false,
      },
    },
    labels: ["Highly Satisfied", "Satisfied", "Low Satisfied", "Unsatisfied"],
    colors: ["#AD63F6", "#C2CDFF", "#FFAA72", "#0dcaf0"],
    stroke: {
      width: 1,
      show: true,
      colors: ["transparent"],
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "73%",
          labels: {
            show: false,
            name: {
              color: "#64748B",
            },
            value: {
              show: true,
              color: "#3A4252",
              fontSize: "28px",
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
      y: {
        formatter: function (val) {
          return val + "%";
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
  };

  return (
    <>
      <div className="trezo-card bg-primary-500 mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !text-white !font-semibold">
              Customer Satisfaction
            </h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
              <MenuButton className="trezo-card-dropdown-btn inline-block transition-all text-white">
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

        <div className="trezo-card-content relative mx-auto max-w-[315px]">
          <div className="relative md:ltr:-left-[80px] md:rtl:-right-[80px] -mt-[5px] -mb-[10px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="donut"
                height={154}
                width={"100%"}
              />
            )}

            <div className="text-center top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 absolute">
              <span className="block text-white">Overall</span>
              <h6 className="!mb-0 !text-[20px] !mt-[5px] !text-white !font-semibold">
                98%
              </h6>
            </div>
          </div>

          <div className="mx-auto text-center md:ltr:right-0 md:rtl:left-0 md:top-1/2 md:-translate-y-1/2 md:absolute md:max-w-[120px] mt-[20px] md:mt-0">
            <Image
              src="/images/man-with-tablet.png"
              className="inline-block"
              alt="man-with-tablet-image"
              width={117}
              height={133}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerSatisfaction;
