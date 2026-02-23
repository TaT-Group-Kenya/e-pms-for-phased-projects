"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const WebsiteVisits: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Users",
      data: [3, 7, 7, 10, 9, 11, 15],
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
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    stroke: {
      curve: "straight",
      width: 1,
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
        formatter: (val) => {
          return "$" + val + "k";
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
      <div className="relative md:ltr:pl-[25px] md:ltr:first:pl-0 md:rtl:pr-[25px] md:rtl:first:pr-0 md:ltr:-mr-[25px] md:rtl:-ml-[25px] md:ltr:first:mr-0 md:rtl:first:ml-0 mt-[20px] sm:mt-0 first:mt-0">
        <span className="block">Website Visits</span>

        <h5 className="!mb-0 !mt-[3px] !text-[20px]">215.2k</h5>

        <div className="absolute -top-[28px] ltr:-right-[9px] rtl:-left-[9px] max-w-[120px]">
          {isChartLoaded && (
            <Chart
              options={options}
              series={series}
              type="area"
              height={95}
              width={"100%"}
            />
          )}
        </div>

        <div className="mt-[12px] flex items-center justify-between">
          <span className="inline-block text-xs text-success-700 px-[9px] border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-xl">
            +10% Increase
          </span>
          <span className="block text-xs">Last 7 days</span>
        </div>
      </div>
    </>
  );
};

export default WebsiteVisits;
