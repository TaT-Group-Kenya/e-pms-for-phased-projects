"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalUsers: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [60, 40, 50];

  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false,
      },
    },
    labels: ["Online User", "Offline User", "None"],
    colors: ["#757DFF", "#58F229", "#5DA8FF"],
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
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content relative">
          <span className="block mb-[5px]">Total Users</span>

          <h3 className="!leading-none !text-lg md:!text-xl !mb-[8px]">241K</h3>

          <span className="inline-block text-xs px-[9px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] rounded-[100px]">
            +5.4%
          </span>

          <div className="absolute mt-[5px] ltr:-right-[110px] rtl:-left-[110px] top-1/2 -translate-y-1/2">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="donut"
                height={90}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalUsers;
