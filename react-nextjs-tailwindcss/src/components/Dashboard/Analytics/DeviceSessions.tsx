"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type DeviceSessionData = {
  type: string;
  color: string;
  percentage: string;
  sessions: string;
};

const DeviceSessions: React.FC = () => {
  // selectedOption state
  const [selectedOption, setSelectedOption] = useState<string>("Last Week");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected option: ${option}`); // Add your logic here
  };

  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [55, 44, 30, 12];

  const options: ApexOptions = {
    labels: ["Desktop", "Mobile", "Tablet", "Others"],
    colors: ["#37D80A", "#605DFF", "#BF85FB", "#FE7A36"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    stroke: {
      width: 1,
      show: true,
      colors: ["#ffffff"],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
    legend: {
      show: false,
      fontSize: "12px",
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 8,
        vertical: 7,
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

  const [deviceData, setDeviceData] = useState<DeviceSessionData[]>([]);

  // Simulate fetching data dynamically
  useEffect(() => {
    const fetchData = async () => {
      // Replace with actual API call if necessary
      const data: DeviceSessionData[] = [
        {
          type: "Desktop",
          color: "bg-success-500",
          percentage: "45.2%",
          sessions: "8,732",
        },
        {
          type: "Mobile",
          color: "bg-primary-400",
          percentage: "48.7%",
          sessions: "9,416",
        },
        {
          type: "Tablet",
          color: "bg-purple-400",
          percentage: "32.3%",
          sessions: "1,042",
        },
        {
          type: "Others",
          color: "bg-orange-400",
          percentage: "15.4%",
          sessions: "135",
        },
      ];
      setDeviceData(data);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Device Sessions</h5>
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
                className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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
          <div className="lg:grid lg:grid-cols-2 gap-[25px] items-center">
            <div>
              <div className="-mt-[7px] lg:-mt-[20px] md:ltr:-ml-[35px] md:rtl:-mr-[35px]">
                {isChartLoaded && (
                  <Chart
                    options={options}
                    series={series}
                    type="pie"
                    height={180}
                    width={"100%"}
                  />
                )}
              </div>
            </div>

            <div>
              <ul className="mb-[20px] lg:mb-[26px] lg:ltr:-ml-[30px] lg:rtl:-mr-[30px]">
                {deviceData.map((device, index) => (
                  <li
                    key={index}
                    className="flex relative justify-between ltr:pl-[22px] rtl:pr-[22px] border-b border-gray-100 dark:border-[#172036] py-[6px] first:border-t"
                  >
                    <div
                      className={`${device.color} absolute ltr:left-0 rtl:right-0 w-[10px] h-[10px] top-1/2 -translate-y-1/2 rounded-full`}
                    ></div>

                    <div>
                      <span className="block text-xs mb-px">{device.type}</span>
                      <h6 className="!mb-0 !text-md !font-semibold !text-black dark:!text-white">
                        {device.percentage}
                      </h6>
                    </div>
                    <div>
                      <span className="block text-xs mb-px">Sessions</span>
                      <h6 className="!mb-0 !font-semibold">{device.sessions}</h6>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-xs">
            This data helps you understand which devices are most commonly used
            and how engagement metrics vary between them.
          </p>
        </div>
      </div>
    </>
  );
};

export default DeviceSessions;
