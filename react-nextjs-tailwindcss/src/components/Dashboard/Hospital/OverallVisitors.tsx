"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OverallVisitors: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Visitors",
      data: [30, 70, 50, 75, 40, 80, 50, 100],
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
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    colors: ["#9747FF"],
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.9,
      },
    },
    xaxis: {
      categories: [
        "01 Jan",
        "02 Jan",
        "03 Jan",
        "04 Jan",
        "05 Jan",
        "06 Jan",
        "07 Jan",
        "08 Jan",
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
      tickAmount: 5,
      show: false,
      max: 100,
      min: 0,
      labels: {
        show: true,
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: true,
        color: "#ECEEF2",
      },
      axisTicks: {
        show: true,
        color: "#ECEEF2",
      },
    },
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    legend: {
      show: true,
      position: "top",
      fontSize: "12px",
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
  };

  return (
    <>
      <div className="trezo-card bg-purple-200 dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md relative">
        <div className="trezo-card-content pb-[81px]">
          <span className="block">Overall Visitors</span>

          <h3 className="!mb-0 !flex !items-center !font-medium !text-xl !mt-[11px]">
            45,745
            <span className="relative font-medium text-xs inline-block text-success-700 bg-success-100 dark:bg-[#15203c] border border-success-300 dark:border-[#15203c] py-[1.5px] ltr:pl-[22px] rtl:pr-[22px] ltr:pr-[10px] rtl:pl-[10px] rounded-full ltr:ml-[10px] rtl:mr-[10px]">
              <i className="ri-arrow-up-fill absolute ltr:left-[6px] rtl:right-[6px] text-base top-1/2 -translate-y-1/2 mt-px"></i>
              7%
            </span>
          </h3>

          <div className="absolute -bottom-[42px] md:-bottom-[37px] ltr:-left-[12px] rtl:-right-[12px] ltr:-right-[10px] rtl:-left-[10px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="area"
                height={160}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OverallVisitors;
