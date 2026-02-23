"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const BasicRangeAreaChart: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "New York Temperature",
      data: [
        {
          x: "Jan",
          y: [-2, 4],
        },
        {
          x: "Feb",
          y: [-1, 6],
        },
        {
          x: "Mar",
          y: [3, 10],
        },
        {
          x: "Apr",
          y: [8, 16],
        },
        {
          x: "May",
          y: [13, 22],
        },
        {
          x: "Jun",
          y: [18, 26],
        },
        {
          x: "Jul",
          y: [21, 29],
        },
        {
          x: "Aug",
          y: [21, 28],
        },
        {
          x: "Sep",
          y: [17, 24],
        },
        {
          x: "Oct",
          y: [11, 18],
        },
        {
          x: "Nov",
          y: [6, 12],
        },
        {
          x: "Dec",
          y: [1, 7],
        },
      ],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: true,
      },
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "New York Temperature (all year round)",
      align: "left",
      offsetX: -9,
      style: {
        fontWeight: "500",
        fontSize: "14px",
        color: "#64748B",
      },
    },
    colors: ["#605DFF"],
    markers: {
      hover: {
        sizeOffset: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      labels: {
        show: true,
        formatter: (val) => {
          return val + "°C";
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
    xaxis: {
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
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#ECEEF2",
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Basic Range Area Chart</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          {isChartLoaded && (
            <Chart
              options={options}
              series={series}
              type="rangeArea"
              height={350}
              width={"100%"}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BasicRangeAreaChart;
