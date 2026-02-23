"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LiveShipmentStatus: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "In Transit",
      data: [70, 60, 40, 40, 35, 30, 40],
    },
    {
      name: "Delivered",
      data: [30, 45, 50, 55, 60, 70, 65],
    },
    {
      name: "Delayed",
      data: [15, 20, 25, 30, 25, 20, 15],
    },
    {
      name: "Canceled",
      data: [5, 10, 15, 20, 15, 10, 5],
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
    colors: ["#3584FC", "#37D80A", "#FD5812", "#EE3E08"],
    stroke: {
      curve: "straight",
      width: 2,
    },
    grid: {
      show: true,
      strokeDashArray: 5,
      borderColor: "#EEF1FF",
    },
    markers: {
      size: 3,
      strokeWidth: 0,
      shape: ["circle", "circle"],
      strokeDashArray: 0, 
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      labels: {
        show: true,
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      max: 80,
      min: 0,
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
        color: "#DDE4FF",
      },
      axisTicks: {
        show: false,
        color: "#DDE4FF",
      },
    },
    legend: {
      show: true,
      position: "left",
      fontSize: "12px",
      horizontalAlign: "right",
      offsetX: -26,
      offsetY: 0,
      itemMargin: {
        horizontal: 0,
        vertical: 5,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 6,
        offsetX: -2,
        offsetY: 0.5,
        shape: "square",
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <span className="block">Live Shipment Status</span>
          </div>
          <div className="trezo-card-subtitle">
            <span className="block">Last 7 days</span>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="-mb-[22px] -mt-[22px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="line"
                height={180}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveShipmentStatus;
