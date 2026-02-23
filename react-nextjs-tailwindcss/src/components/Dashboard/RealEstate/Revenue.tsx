"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RevenueData {
  x: string;
  y: number;
  goals: {
    name: string;
    value: number;
    strokeHeight: number;
    strokeColor: string;
    strokeWidth?: number;
    strokeLineCap?: "butt" | "round" | "square";
  }[];
}

const Revenue: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState<boolean>(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series: { name: string; data: RevenueData[] }[] = [
    {
      name: "Income",
      data: [
        {
          x: "2019",
          y: 1292,
          goals: [
            {
              name: "Expenses",
              value: 1400,
              strokeHeight: 5,
              strokeColor: "#FFCEA9",
            },
          ],
        },
        {
          x: "2018",
          y: 4432,
          goals: [
            {
              name: "Expenses",
              value: 5400,
              strokeHeight: 5,
              strokeColor: "#FFCEA9",
            },
          ],
        },
        {
          x: "2020",
          y: 5423,
          goals: [
            {
              name: "Expenses",
              value: 5200,
              strokeHeight: 5,
              strokeColor: "#FFCEA9",
            },
          ],
        },
        {
          x: "2021",
          y: 6653,
          goals: [
            {
              name: "Expenses",
              value: 6500,
              strokeHeight: 5,
              strokeColor: "#FFCEA9",
            },
          ],
        },
        {
          x: "2022",
          y: 8133,
          goals: [
            {
              name: "Expenses",
              value: 6600,
              strokeHeight: 13,
              strokeWidth: 0,
              strokeLineCap: "round",
              strokeColor: "#FFCEA9",
            },
          ],
        },
        {
          x: "2023",
          y: 7132,
          goals: [
            {
              name: "Expenses",
              value: 7500,
              strokeHeight: 5,
              strokeColor: "#FFCEA9",
            },
          ],
        },
        {
          x: "2024",
          y: 7332,
          goals: [
            {
              name: "Expenses",
              value: 8700,
              strokeHeight: 5,
              strokeColor: "#FFCEA9",
            },
          ],
        },
      ],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "15.41px",
      },
    },
    colors: ["#FD5812"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: ["Income", "Expenses"],
      position: "right",
      fontSize: "12px",
      offsetX: -17,
      offsetY: 52,
      itemMargin: {
        horizontal: 0,
        vertical: 4,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 5,
        offsetX: -2,
        offsetY: 0,
        shape: "square",
        fillColors: ["#FD5812", "#FFCEA9"],
      },
    },
    xaxis: {
      axisTicks: {
        show: false,
        color: "#DDE4FF",
      },
      axisBorder: {
        show: false,
        color: "#DDE4FF",
      },
      labels: {
        show: false,
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        show: false,
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
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return "$" + val + "k";
        },
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[15px]">
              <div>
                <span className="block mb-[4px]">Revenue</span>
                <h3 className="!mb-0 !text-[20px]">$194,712</h3>
              </div>
              <span className="inline-block px-[8.5px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px] text-xs">
                +60%
              </span>
            </div>
            <span className="block text-xs">Last 7 days</span>
          </div>
          <div className="-mb-[30px] -mt-[17px] max-w-[310px] mx-auto">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={135}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Revenue;
