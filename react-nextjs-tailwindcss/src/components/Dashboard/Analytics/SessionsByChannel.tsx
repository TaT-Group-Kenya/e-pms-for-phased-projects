"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SessionsByChannel: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last 30 Days");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [976, 651, 818, 459, 320, 209];

  const options: ApexOptions = {
    labels: [
      "Email",
      "Organic Search",
      "Direct Browse",
      "Paid Search",
      "Social",
      "Referral",
    ],
    colors: ["#3584FC", "#37D80A", "#BF85FB", "#90C7FF", "#605DFF", "#FE7A36"],
    stroke: {
      width: 1,
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
          labels: {
            show: true,
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
      enabled: false,
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Sessions by Channel</h5>
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
          {isChartLoaded && (
            <Chart
              options={options}
              series={series}
              type="donut"
              height={256}
              width={"100%"}
            />
          )}

          <ul className="text-center my-[10px]">
            <li className="inline-block ltr:text-left rtl:text-right mx-[13px] lg:mx-[10px] xl:mx-[13px] mt-[15px]">
              <span className="text-xs mb-[8px] flex items-center justify-center">
                <span className="block bg-secondary-500 w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm relative -top-[1px]"></span>
                Email
              </span>
              <h6 className="!mb-0 !leading-none !font-medium !text-lg ltr:!ml-[19px] rtl:!mr-[19px]">
                976
              </h6>
            </li>
            <li className="inline-block ltr:text-left rtl:text-right mx-[13px] lg:mx-[10px] xl:mx-[13px] mt-[15px]">
              <span className="text-xs mb-[8px] flex items-center justify-center">
                <span className="block bg-success-500 w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm relative -top-[1px]"></span>
                Organic Search
              </span>
              <h6 className="!mb-0 !leading-none !font-medium !text-lg ltr:!ml-[19px] rtl:!mr-[19px]">
                651
              </h6>
            </li>
            <li className="inline-block ltr:text-left rtl:text-right mx-[13px] lg:mx-[10px] xl:mx-[13px] mt-[15px]">
              <span className="text-xs mb-[8px] flex items-center justify-center">
                <span className="block bg-purple-500 w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm relative -top-[1px]"></span>
                Direct Browse
              </span>
              <h6 className="!mb-0 !leading-none !font-medium !text-lg ltr:!ml-[19px] rtl:!mr-[19px]">
                818
              </h6>
            </li>
            <li className="inline-block ltr:text-left rtl:text-right mx-[13px] lg:mx-[10px] xl:mx-[13px] mt-[15px]">
              <span className="text-xs mb-[8px] flex items-center justify-center">
                <span className="block bg-secondary-300 w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm relative -top-[1px]"></span>
                Paid Search
              </span>
              <h6 className="!mb-0 !leading-none !font-medium !text-lg ltr:!ml-[19px] rtl:!mr-[19px]">
                459
              </h6>
            </li>
            <li className="inline-block ltr:text-left rtl:text-right mx-[13px] lg:mx-[10px] xl:mx-[13px] mt-[15px]">
              <span className="text-xs mb-[8px] flex items-center justify-center">
                <span className="block bg-primary-500 w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm relative -top-[1px]"></span>
                Social
              </span>
              <h6 className="!mb-0 !leading-none !font-medium !text-lg ltr:!ml-[19px] rtl:!mr-[19px]">
                320
              </h6>
            </li>
            <li className="inline-block ltr:text-left rtl:text-right mx-[13px] lg:mx-[10px] xl:mx-[13px] mt-[15px]">
              <span className="text-xs mb-[8px] flex items-center justify-center">
                <span className="block bg-orange-500 w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm relative -top-[1px]"></span>
                Referral
              </span>
              <h6 className="!mb-0 !leading-none !font-medium !text-lg ltr:!ml-[19px] rtl:!mr-[19px]">
                209
              </h6>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SessionsByChannel;
