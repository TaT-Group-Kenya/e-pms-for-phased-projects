"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const EmployeeAttendanceTrends: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Attendance",
      data: [170, 450, 400, 550, 550, 650, 820],
    },
    {
      name: "Absent",
      data: [320, 300, 650, 400, 750, 650, 600],
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
    colors: ["#605DFF", "#EE3E08"],
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
      strokeDashArray: 7,
      borderColor: "#ECEEF2",
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
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
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      axisTicks: {
        show: false,
        color: "#D5D9E2",
      },
      axisBorder: {
        show: true,
        color: "#D5D9E2",
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
      tickAmount: 6,
      max: 960,
      min: 0,
      labels: {
        // formatter: (val) => {
        //     return '$' + val + 'k'
        // },
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: true,
        color: "#D5D9E2",
      },
      axisTicks: {
        show: false,
        color: "#D5D9E2",
      },
    },
    legend: {
      show: true,
      fontSize: "12px",
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 12,
        vertical: 10,
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
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 !font-semibold">Employee Attendance Trends</h5>
          </div>
          <div className="trezo-card-subtitle mt-[12px] sm:mt-0">
            <button
              type="button"
              className="rounded-md inline-block transition-all py-[3.5px] px-[15px] bg-[#F6F7F9] dark:bg-[#0a0e19] border border-gray-100 dark:border-[#172036] hover:border-primary-500 hover:bg-primary-500 hover:text-white"
            >
              <span className="inline-block relative ltr:pl-[24px] rtl:pr-[24px]">
                <i className="ri-calendar-line absolute text-[16px] top-1/2 -translate-y-1/2 ltr:left-0 rtl:right-0"></i>
                July 01 - July 31, 2024
              </span>
            </button>
          </div>
        </div>

        <div className="trezo-card-content">
          <ul>
            <li className="md:inline-block mb-[7px] md:mb-0">
              Avg. Daily Attend:{" "}
              <span className="font-semibold ltr:2xl:ml-[6px] rtl:2xl:mr-[6px]">
                320
              </span>
            </li>
            <li className="hidden md:inline-block mb-[7px] md:mb-0">
              <div className="w-[1px] h-[10px] bg-[#D5D9E2] mx-[12px] lg:mx-[8px] xl:mx-[15px] 2xl:mx-[21px]"></div>
            </li>
            <li className="md:inline-block mb-[7px] md:mb-0">
              High. Attend:{" "}
              <span className="font-semibold ltr:2xl:ml-[6px] rtl:2xl:mr-[6px]">
                340
              </span>{" "}
              (October 5th)
            </li>
            <li className="hidden md:inline-block mb-[7px] md:mb-0">
              <div className="w-[1px] h-[10px] bg-[#D5D9E2] mx-[12px] lg:mx-[8px] xl:mx-[15px] 2xl:mx-[21px]"></div>
            </li>
            <li className="md:inline-block mb-[7px] md:mb-0">
              Low. Attend:{" "}
              <span className="font-semibold ltr:2xl:ml-[6px] rtl:2xl:mr-[6px]">
                290
              </span>{" "}
              (October 1st)
            </li>
          </ul>

          <div className="ltr:-ml-[15px] rtl:-mr-[15px] -mb-[25px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="area"
                height={424}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeAttendanceTrends;
