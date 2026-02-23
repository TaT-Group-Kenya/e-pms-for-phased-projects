"use client";

import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TradingVolume: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Volume",
      data: [130, 200, 160, 80, 70, 120, 140],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#757DFF"],
    plotOptions: {
      bar: {
        columnWidth: "15px",
        colors: {
          backgroundBarColors: ["#DDE4FF"],
          backgroundBarOpacity: 0.2,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#F6F7F9",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
      tickAmount: 4,
      max: 200,
      min: 0,
      labels: {
        formatter: (val) => {
          return "$" + val;
        },
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
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + val + "k";
        },
      },
    },
    legend: {
      show: true,
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
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header flex items-center justify-between">
          <div className="trezo-card-title flex items-center gap-[15px]">
            <div>
              <span className="block mb-[3px]">Trading Volume</span>
              <h5 className="!mb-0 !text-[20px]">$117,950</h5>
            </div>
            <span className="inline-block text-xs font-medium px-[8px] text-success-600 border border-success-600 bg-success-100 rounded-[100px] dark:bg-[#15203c] dark:border-[#15203c]">
              +7.6%
            </span>
          </div>
          <div className="trezo-card-subtitle">Last 7 days</div>
        </div>

        <div className="trezo-card-content">
          <div className="-mb-[25px] -mt-[3px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={200}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TradingVolume;
