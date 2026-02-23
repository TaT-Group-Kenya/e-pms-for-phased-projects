"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const EthereumRate: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Earnings",
      data: [20, 40, 60, 60, 50, 30, 40, 30, 40, 40, 60, 60],
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
    colors: ["#3584FC"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "stepline", //curve: ['straight', 'smooth', 'monotoneCubic', 'stepline']
      width: 3,
      lineCap: "round",
    },
    grid: {
      borderColor: "#ECF0FF",
      strokeDashArray: 10,
      xaxis: {
        lines: {
          show: false,
        },
      },
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
      tickAmount: 4,
      show: false,
      max: 80,
      min: 0,
      labels: {
        formatter: (val) => {
          return "$" + val + "K";
        },
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
        shape: "circle",
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <span className="block mb-[7px]">Ethereum Rate</span>

          <div className="flex items-center gap-[10px]">
            <h3 className="!leading-none !text-xl md:!text-2xl lg:!text-3xl !mb-0">
              $1,528
            </h3>
            <span className="inline-block text-xs px-[9px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] rounded-[100px]">
              +5.4%
            </span>
          </div>

          <span className="block text-xs mt-[9px]">vs previous 30 days</span>

          <div className="mt-[20px] md:mt-[25px] flex items-center gap-[30px]">
            <button
              type="button"
              className="inline-block rounded-[4px] transition-all bg-primary-500 text-white w-[34px] h-[28px]"
            >
              1d
            </button>
            <button
              type="button"
              className="inline-block rounded-[4px] transition-all hover:bg-primary-500 hover:text-white w-[34px] h-[28px]"
            >
              15d
            </button>
            <button
              type="button"
              className="inline-block rounded-[4px] transition-all hover:bg-primary-500 hover:text-white w-[34px] h-[28px]"
            >
              1m
            </button>
            <button
              type="button"
              className="inline-block rounded-[4px] transition-all hover:bg-primary-500 hover:text-white w-[34px] h-[28px]"
            >
              6m
            </button>
            <button
              type="button"
              className="inline-block rounded-[4px] transition-all hover:bg-primary-500 hover:text-white w-[34px] h-[28px]"
            >
              1y
            </button>
          </div>
 
          <div>
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="area"
                height={238}
                width={"100%"}
              />
            )}
          </div>

          <ul>
            <li className="flex items-center justify-between mb-[18px] last:mb-0">
              <span className="block text-xs font-semibold">11:30 AM</span>
              <span className="block text-xs font-semibold text-gray-700 dark:text-gray-400">
                $3,605.08
              </span>
              <span className="block text-xs font-semibold text-success-700">
                +5.4%
              </span>
            </li>

            <li className="flex items-center justify-between mb-[18px] last:mb-0">
              <span className="block text-xs font-semibold">01:20 PM</span>
              <span className="block text-xs font-semibold text-gray-700 dark:text-gray-400">
                $3,615.50
              </span>
              <span className="block text-xs font-semibold text-orange-600">
                -3.21%
              </span>
            </li>

            <li className="flex items-center justify-between mb-[18px] last:mb-0">
              <span className="block text-xs font-semibold">03:33 AM</span>
              <span className="block text-xs font-semibold text-gray-700 dark:text-gray-400">
                $3,831.13
              </span>
              <span className="block text-xs font-semibold text-success-700">
                +7.32%
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default EthereumRate;
