"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const InstagramCampaigns: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Budget",
      data: [80, 200, 90, 220, 110, 220, 85],
    },
    {
      name: "Followers",
      data: [20, 120, 155, 90, 165, 100, 120],
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
      curve: "smooth",
      width: 2,
    },
    colors: ["#AD63F6", "#FF6D57"],
    fill: {
      type: "gradient",
      gradient: {
        stops: [0, 90, 100],
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.5,
      },
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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
      // tickAmount: 5,
      show: false,
      max: 250,
      // min: 0,
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
      show: false,
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
    tooltip: {
      y: {
        formatter: function (value, { seriesIndex }) {
          if (seriesIndex === 0) {
            return "$" + value.toString(); // Convert the number to a string
          }
          return value.toString(); // Convert the number to a string
        },
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] flex items-center justify-between">
          <div className="trezo-card-title flex items-center gap-[10px]">
            <h5 className="!mb-0">Instagram Campaigns</h5>
            <span className="px-[8px] py-[3px] inline-block bg-orange-100 dark:bg-[#15203c] text-orange-600 rounded-sm font-medium text-xs">
              Live Now
            </span>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="flex items-center gap-[25px]">
            <div>
              <div className="flex items-center gap-[5px] mb-[5px]">
                <span className="block w-[10px] h-[10px] rounded-full bg-purple-500"></span>
                <span className="block text-sm">Campaign Budget</span>
              </div>
              <h3 className="!mb-0 !leading-none !text-[20px]">$3200</h3>
            </div>
            <div>
              <div className="flex items-center gap-[5px] mb-[5px]">
                <span className="block w-[10px] h-[10px] rounded-full bg-orange-400"></span>
                <span className="block text-sm">Followers Goal</span>
              </div>
              <h3 className="!mb-0 !leading-none !text-[20px]">140,000</h3>
            </div>
          </div>

          <div className="h-[76px] relative">
            <div className="absolute left-0 right-0 -bottom-[55px] -ml-[33px] md:-ml-[37px] -mr-[30px] md:-mr-[35px]">
              {isChartLoaded && (
                <Chart
                  options={options}
                  series={series}
                  type="area"
                  height={140}
                  width={"100%"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstagramCampaigns;
