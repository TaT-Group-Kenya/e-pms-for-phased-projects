"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ResignedEmployees: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Employees",
      data: [60, 35, 55, 30, 45, 30, 55],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#FD5812"],
    plotOptions: {
      bar: {
        borderRadius: 3,
        columnWidth: "8px",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      show: true,
      colors: ["transparent"],
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
      labels: {
        show: false,
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
    fill: {
      opacity: 1,
    },
    grid: {
      show: false,
      borderColor: "#ECEEF2",
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
        shape: "square",
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[30px] rounded-md">
        <div className="trezo-card-content relative">
          <div className="flex items-center gap-[12px]">
            <div className="bg-orange-100 dark:bg-[#15203c] text-orange-700 rounded-[4px] w-[26px] h-[26px] flex items-center justify-center text-lg">
              <i className="material-symbols-outlined">person_remove</i>
            </div>
            <div>
              <span className="block">Resigned Employees</span>
              <h5 className="!mb-0 !mt-[2px] !text-[20px] !font-semibold">
                318
              </h5>
            </div>
          </div>
          <div className="mt-[32px] flex items-center gap-[7px]">
            <div className="bg-orange-100 text-orange-700 rounded-[4px] w-[26px] h-[26px] flex items-center justify-center text-[18px]">
              <i className="ri-arrow-right-down-line"></i>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-400">
                -5%
              </span>{" "}
              last year
            </div>
          </div>
          <div className="absolute -bottom-[25px] ltr:-right-[10px] rtl:-left-[10px] max-w-[125px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={140}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResignedEmployees;
