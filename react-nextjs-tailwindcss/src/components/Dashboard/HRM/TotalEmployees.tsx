"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalEmployees: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Employees",
      data: [3, 12, 8, 13, 8, 10, 16],
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
    colors: ["#4936F5"],
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100],
      },
    },
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    stroke: {
      curve: "monotoneCubic",
      width: 0,
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
        // formatter: (val) => {
        //     return val + 'k'
        // },
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
            <div className="bg-primary-600 rounded-[4px] text-white w-[44px] h-[44px] flex items-center justify-center">
              <i className="material-symbols-outlined">group</i>
            </div>
            <div>
              <span className="block">Total Employees</span>
              <h5 className="!mb-0 !mt-[2px] !text-[20px] !font-semibold">
                15,720
              </h5>
            </div>
          </div>

          <div className="mt-[32px] flex items-center gap-[7px]">
            <div className="bg-success-100 dark:bg-[#15203c] text-success-700 rounded-[4px] w-[26px] h-[26px] flex items-center justify-center text-lg">
              <i className="ri-arrow-right-up-line"></i>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-400">
                +12%
              </span>{" "}
              last year
            </div>
          </div>

          <div className="absolute -bottom-[20px] ltr:-right-[10px] rtl:-left-[10px] max-w-[125px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="area"
                height={125}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalEmployees;
