"use client";

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TodaysPayment: React.FC = () => {
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

  const series = [
    {
      name: "Payment",
      data: [40, 50, 80, 50, 40, 30, 40, 50, 60, 70, 50, 65],
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
    colors: ["#ffffff"],
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
        color: "#ffffff1a",
      },
      axisBorder: {
        show: false,
        color: "#ffffff1a",
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
      tickAmount: 5,
      max: 100,
      min: 0,
      labels: {
        formatter: (val) => {
          return "$" + val + "K";
        },
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
        color: "#ffffff1a",
      },
      axisTicks: {
        show: false,
        color: "#ffffff1a",
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
        shape: "circle",
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "k";
        },
      },
      marker: {
        show: true,
        fillColors: ["#BE84F9"],
      },
    },
  };

  return (
    <>
      <div
        className="trezo-card p-[20px] md:p-[25px] rounded-md"
        style={{
          background: "linear-gradient(104deg, #361E7D 2.4%, #403CFF 112.33%)",
        }}
      >
        <div className="trezo-card-content">
          <div className="flex items-center justify-between">
            <div>
              <span className="block mb-[7px] text-gray-300">
                Today’s Payment
              </span>
              <div className="flex items-center gap-[10px]">
                <h3 className="!leading-none !text-white !text-xl md:!text-2xl lg:!text-3xl !mb-0">
                  $1,528
                </h3>
                <span className="inline-block text-xs px-[9px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] rounded-[100px]">
                  +5.4%
                </span>
              </div>
            </div>

            <div className="trezo-card-subtitle">
              <Menu as="div" className="trezo-card-dropdown relative">
                <MenuButton className="trezo-card-dropdown-btn inline-block rounded-md border border-primary-500 bg-primary-500 text-white py-[5px] md:py-[6.5px] px-[12px] md:px-[19px] transition-all hover:bg-primary-400 hover:border-primary-400">
                  <span className="inline-block relative ltr:pr-[17px] ltr:md:pr-[20px] rtl:pl-[17px] rtl:ml:pr-[20px]">
                    {selectedOption}
                    <i className="ri-arrow-down-s-line text-lg absolute ltr:-right-[3px] rtl:-left-[3px] top-1/2 -translate-y-1/2"></i>
                  </span>
                </MenuButton>

                <MenuItems
                  transition
                  className="transition-all bg-white shadow-3xl rounded-md top-full py-[15px] absolute ltr:right-0 rtl:left-0 w-[195px] z-[50] dark:bg-dark dark:shadow-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {["Weekly", "Monthly", "Yearly"].map((option) => (
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

          <div className="-mb-[18px] ltr:-ml-[15px] rtl:-mr-[15px] mt-[10px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="area"
                height={323}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TodaysPayment;
