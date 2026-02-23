"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalRevenue: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Fashion",
      data: [20, 40, 25, 60, 30, 50],
    },
    {
      name: "Others",
      data: [20, 20, 25, 15, 35, 25],
    },
  ];

  const options: ApexOptions = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "55%",
      },
    },
    colors: ["#605DFF", "#C2CDFF"],
    grid: {
      show: true,
      borderColor: "#ffffff",
    },
    stroke: {
      width: 2,
      show: true,
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
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
      show: false,
      labels: {
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
      fontSize: "12px",
      position: "bottom",
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
    fill: {
      opacity: 1,
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="block">Total Revenue</span>
              <span className="inline-block px-[8.3px] py-[1px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] text-sm ltr:ml-[10px] rtl:mr-[10px] rounded-[100px]">
                +10%
              </span>
            </div>
            <span className="block text-sm">Last 30 days</span>
          </div>

          <h5 className="!text-lg md:!text-[20px] !mb-0 !mt-[5px]">$165,458</h5>

          <div className="mx-auto max-w-[200px] -mt-[20px] md:-mt-[30px] -mb-[10px] md:-mb-[20px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={110}
                width={"100%"}
              />
            )}
          </div>

          <ul>
            <li className="text-sm ltr:pl-[30px] rtl:pr-[30px] flex justify-between relative mb-[4px] last:mb-0">
              <span className="inline-block bg-primary-500 ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 w-[20px] h-[5px] rounded-md"></span>
              <span className="block">Fashion</span>
              <span className="block">75%</span>
            </li>

            <li className="text-sm ltr:pl-[30px] rtl:pr-[30px] flex justify-between relative mb-[4px] last:mb-0">
              <span className="inline-block bg-primary-200 ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 w-[20px] h-[5px] rounded-md"></span>
              <span className="block">Others</span>
              <span className="block">25%</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default TotalRevenue;
