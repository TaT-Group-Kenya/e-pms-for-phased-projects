"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const EmployeeWorkFormat: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Monthly");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [120, 160, 50, 20];

  const options: ApexOptions = {
    labels: ["Remote", "In-office", "Hybrid", "Shift"],
    colors: ["#FD5812", "#605DFF", "#37D80A", "#AD63F6"],
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
        shape: "square",
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
              fontSize: "22px",
              fontWeight: "600",
              offsetY: 2,
            },
            total: {
              show: true,
              fontSize: "14px",
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
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Employee Work Format</h5>
          </div>

          <div className="trezo-card-subtitle">
            <Menu as="div" className="trezo-card-dropdown relative">
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

        <div className="trezo-card-content">
          <div className="lg:mt-[43px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="donut"
                height={217}
                width={"100%"}
              />
            )}
          </div>

          <div className="mt-[10px] md:mt-[15px] -mb-[25px] lg:mt-[35px] -mx-[20px] md:-mx-[25px]">
            <div className="table-responsive overflow-x-auto">
              <table className="w-full">
                <tbody className="text-black dark:text-white">
                  <tr>
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      <div className="flex items-center gap-[8px]">
                        <div className="bg-orange-500 w-[8px] h-[8px]"></div>
                        Remote
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      <span className="text-success-600 inline-block relative ltr:pr-[24px] rtl:pl-[24px]">
                        34%
                        <i className="material-symbols-outlined absolute ltr:right-0 rtl:left-0 !text-[20px] top-1/2 -translate-y-1/2">
                          trending_up
                        </i>
                      </span>
                    </td>
                    <td className="font-bold ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      120
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      <div className="flex items-center gap-[8px]">
                        <div className="bg-primary-500 w-[8px] h-[8px]"></div>
                        In-office
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      <span className="text-danger-600 inline-block relative ltr:pr-[24px] rtl:pl-[24px]">
                        46%
                        <i className="material-symbols-outlined absolute ltr:right-0 rtl:left-0 !text-[20px] top-1/2 -translate-y-1/2">
                          trending_down
                        </i>
                      </span>
                    </td>
                    <td className="font-bold ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      160
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      <div className="flex items-center gap-[8px]">
                        <div className="bg-success-500 w-[8px] h-[8px]"></div>
                        Hybrid
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      <span className="text-success-600 inline-block relative ltr:pr-[24px] rtl:pl-[24px]">
                        15%
                        <i className="material-symbols-outlined absolute ltr:right-0 rtl:left-0 !text-[20px] top-1/2 -translate-y-1/2">
                          trending_up
                        </i>
                      </span>
                    </td>
                    <td className="font-bold ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      50
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      <div className="flex items-center gap-[8px]">
                        <div className="bg-purple-500 w-[8px] h-[8px]"></div>
                        Shift
                      </div>
                    </td>
                    <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      <span className="text-danger-600 inline-block relative ltr:pr-[24px] rtl:pl-[24px]">
                        5%
                        <i className="material-symbols-outlined absolute ltr:right-0 rtl:left-0 !text-[20px] top-1/2 -translate-y-1/2">
                          trending_down
                        </i>
                      </span>
                    </td>
                    <td className="font-bold ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[13px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] ltr:last:text-right rtl:last:text-left">
                      20
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeWorkFormat;
