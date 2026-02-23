"use client";

import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PriceMovement: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Price",
      data: [
        {
          x: new Date(2016, 1, 1),
          y: [51.98, 56.29, 51.59, 53.85],
        },
        {
          x: new Date(2016, 2, 1),
          y: [53.66, 54.99, 51.35, 52.95],
        },
        {
          x: new Date(2016, 3, 1),
          y: [52.96, 53.78, 51.54, 52.48],
        },
        {
          x: new Date(2016, 4, 1),
          y: [52.54, 52.79, 47.88, 49.24],
        },
        {
          x: new Date(2016, 5, 1),
          y: [49.1, 52.86, 47.7, 52.78],
        },
        {
          x: new Date(2016, 6, 1),
          y: [52.83, 53.48, 50.32, 52.29],
        },
        {
          x: new Date(2016, 7, 1),
          y: [52.2, 54.48, 51.64, 52.58],
        },
        {
          x: new Date(2016, 8, 1),
          y: [52.76, 57.35, 52.15, 57.03],
        },
        {
          x: new Date(2016, 9, 1),
          y: [57.04, 58.15, 48.88, 56.19],
        },
        {
          x: new Date(2016, 10, 1),
          y: [56.09, 58.85, 55.48, 58.79],
        },
        {
          x: new Date(2016, 11, 1),
          y: [58.78, 59.65, 58.23, 59.05],
        },
        {
          x: new Date(2017, 0, 1),
          y: [59.37, 61.11, 59.35, 60.34],
        },
        {
          x: new Date(2017, 1, 1),
          y: [60.4, 60.52, 56.71, 56.93],
        },
        {
          x: new Date(2017, 2, 1),
          y: [57.02, 59.71, 56.04, 56.82],
        },
        {
          x: new Date(2017, 3, 1),
          y: [66.97, 69.62, 54.77, 59.3],
        },
        {
          x: new Date(2017, 4, 1),
          y: [59.11, 62.29, 59.1, 59.85],
        },
        {
          x: new Date(2017, 5, 1),
          y: [59.97, 60.11, 55.66, 58.42],
        },
        {
          x: new Date(2017, 6, 1),
          y: [58.34, 60.93, 56.75, 57.42],
        },
        {
          x: new Date(2017, 7, 1),
          y: [57.76, 58.08, 51.18, 54.71],
        },
        {
          x: new Date(2017, 8, 1),
          y: [64.8, 71.42, 53.18, 57.35],
        },
        {
          x: new Date(2017, 9, 1),
          y: [57.56, 63.09, 57.0, 62.99],
        },
        {
          x: new Date(2017, 10, 1),
          y: [62.89, 63.42, 59.72, 61.76],
        },
        {
          x: new Date(2017, 11, 1),
          y: [61.71, 64.15, 61.29, 63.04],
        },
      ],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#37D80A",
          downward: "#FF4023",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      type: "datetime",
      axisTicks: {
        show: true,
        color: "#64748B",
      },
      axisBorder: {
        show: true,
        color: "#64748B",
      },
      labels: {
        show: true,
        style: {
          colors: "#3A4252",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        show: true,
        style: {
          colors: "#3A4252",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
        color: "#64748B",
      },
      axisTicks: {
        show: false,
        color: "#64748B",
      },
    },
    grid: {
      show: true,
      borderColor: "#F6F7F9",
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Price Movement</h5>
          </div>

          <div className="trezo-card-subtitle">
            <button
              type="button"
              className="inline-block transition-all w-[40px] h-[30px] rounded-[4px] border border-primary-500 dark:border-[#172036] bg-primary-500 text-white mx-[2px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0"
            >
              1h
            </button>
            <button
              type="button"
              className="inline-block transition-all w-[40px] h-[30px] rounded-[4px] border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 mx-[2px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0"
            >
              1d
            </button>
            <button
              type="button"
              className="inline-block transition-all w-[40px] h-[30px] rounded-[4px] border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 mx-[2px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0"
            >
              1w
            </button>
            <button
              type="button"
              className="inline-block transition-all w-[40px] h-[30px] rounded-[4px] border border-gray-100 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500 mx-[2px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0"
            >
              1m
            </button>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="-mt-[18px] -mb-[15px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="candlestick"
                height={515}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceMovement;
