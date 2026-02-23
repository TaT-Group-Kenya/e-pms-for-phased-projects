"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LeadsBySource: React.FC = () => {
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

  const series = [320, 60, 30, 160, 279, 19];

  const options: ApexOptions = {
    labels: ["Organic", "Paid", "Direct", "Social", "Referrals", "Others"],
    colors: ["#605DFF", "#3584FC", "#AD63F6", "#0dcaf0", "#25B003", "#FD5812"],
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
        size: 6,
        offsetX: -2,
        offsetY: -0.5,
        shape: "circle",
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
            <h5 className="!mb-0">Leads by Source</h5>
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
          <div className="-mt-[10px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="donut"
                height={266}
                width={"100%"}
              />
            )}
          </div>

          <ul className="mt-[17px] grid grid-cols-3 gap-[25px]">
            <li>
              <span className="flex items-center text-sm mb-[7px]">
                <span className="w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm bg-primary-500 d-block"></span>
                Organic
              </span>
              <h6 className="!mb-0 !leading-none !text-lg !font-medium">320</h6>
            </li>
            <li>
              <span className="flex items-center text-sm mb-[7px]">
                <span className="w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm bg-secondary-500 d-block"></span>
                Paid
              </span>
              <h6 className="!mb-0 !leading-none !text-lg !font-medium">60</h6>
            </li>
            <li>
              <span className="flex items-center text-sm mb-[7px]">
                <span className="w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm bg-purple-500 d-block"></span>
                Direct
              </span>
              <h6 className="!mb-0 !leading-none !text-lg !font-medium">30</h6>
            </li>
            <li>
              <span className="flex items-center text-sm mb-[7px]">
                <span className="w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm bg-info-500 d-block"></span>
                Social
              </span>
              <h6 className="!mb-0 !leading-none !text-lg !font-medium">160</h6>
            </li>
            <li>
              <span className="flex items-center text-sm mb-[7px]">
                <span className="w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm bg-success-500 d-block"></span>
                Referrals
              </span>
              <h6 className="!mb-0 !leading-none !text-lg !font-medium">279</h6>
            </li>
            <li>
              <span className="flex items-center text-sm mb-[7px]">
                <span className="w-[11px] h-[11px] ltr:mr-[8px] rtl:ml-[8px] rounded-sm bg-danger-500 d-block"></span>
                Others
              </span>
              <h6 className="!mb-0 !leading-none !text-lg !font-medium">19</h6>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default LeadsBySource;
