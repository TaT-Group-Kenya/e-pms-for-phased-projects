"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesByCategory: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Electronics",
      data: [20, 100, 70, 30, 50, 80, 70],
    },
    {
      name: "Non-electronics",
      data: [68, 80, 33, 80, 70, 40, 30],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: true,
    },
    colors: ["#FC6829", "#757DFF"],
    plotOptions: {
      radar: {
        polygons: {
          fill: {
            colors: ["#f8f8f8", "#ffffff"],
          },
        },
      },
    },
    xaxis: {
      categories: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      labels: {
        show: true,
        style: {
          colors: "#A8A8A8",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      show: false,
    },
    legend: {
      show: true,
      offsetY: -10,
      fontSize: "12px",
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 6,
        offsetX: -4,
        offsetY: -0.5,
        strokeWidth: 0,
        shape: "square",
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Sales By Category</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="-mt-[20px] ltr:-ml-[15px] rtl:-mr-[15px] -mb-[15px]">
            <div id="salesByCategoryChart"></div>

            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="radar"
                height={355}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesByCategory;
