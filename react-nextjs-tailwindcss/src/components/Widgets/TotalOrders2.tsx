"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalOrders: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Completed",
      data: [80, 55, 60, 55, 80],
    },
    {
      name: "Pending",
      data: [50, 85, 60, 70, 60],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#1F64F1", "#C2CDFF"],
    plotOptions: {
      bar: {
        columnWidth: "85%",
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
    grid: {
      show: true,
      borderColor: "#ffffff",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May"],
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
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="block">Total Orders</span>
              <span className="inline-block px-[8.3px] py-[1px] text-orange-700 border border-orange-200 bg-danger-100 dark:bg-[#15203c] dark:border-[#172036] text-sm ltr:ml-[10px] rtl:mr-[10px] rounded-[100px]">
                -7.6%
              </span>
            </div>
            <span className="block text-sm">Last 7 days</span>
          </div>

          <h5 className="!text-lg md:!text-[20px] !mb-0 !mt-[5px]">$72,458</h5>

          <div className="mx-auto max-w-[150px] -mt-[10px] -mb-[10px] md:-mt-[25px] md:-mb-[16px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={100}
                width={"100%"}
              />
            )}
          </div>

          <ul>
            <li className="text-sm ltr:pl-[30px] rtl:pr-[30px] flex justify-between relative mb-[4px] last:mb-0">
              <span className="inline-block bg-primary-500 ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 w-[20px] h-[5px] rounded-md"></span>
              <span className="block">Completed</span>
              <span className="block">62%</span>
            </li>
            
            <li className="text-sm ltr:pl-[30px] rtl:pr-[30px] flex justify-between relative mb-[4px] last:mb-0">
              <span className="inline-block bg-primary-200 ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2 w-[20px] h-[5px] rounded-md"></span>
              <span className="block">Pending</span>
              <span className="block">38%</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default TotalOrders;
