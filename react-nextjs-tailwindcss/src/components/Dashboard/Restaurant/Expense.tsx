"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Expense: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Up",
      data: [70, 42, 70, 120, 40, 70],
    },
    {
      name: "Down",
      data: [-70, -44, -70, -120, -40, -70],
    },
  ];

  const options: ApexOptions = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ["#BF85FB", "#5DA8FF"],
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "4px",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 7,
      borderColor: "#ECEEF2",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
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
    tooltip: {
      y: {
        formatter: function (value) {
          return `${Math.abs(value).toFixed(2)}%`; // Ensure that negative values appear as positive in the tooltip
        },
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
        <div className="trezo-card-content relative">
          <span className="block">Expense</span>
          <h3 className="!-tracking-[0.5px] !mb-[4px] !mt-px !text-3xl">$132K</h3>
          <span className="inline-block text-xs px-[9px] text-danger-700 border border-danger-300 bg-danger-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px]">
            -1.2%
          </span>
          <span className="block text-xs mt-[5px]">vs previous 30 days</span>
          <div className="absolute ltr:-right-[8px] rtl:-left-[8px] top-1/2 -translate-y-1/2 max-w-[120px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
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

export default Expense;
