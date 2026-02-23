"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Revenue: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [80, 20];

  const options: ApexOptions = {
    labels: ["Revenue", "Revenue"],
    colors: ["#58F229", "#D8FFC8"],
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + val + "M";
        },
      },
    },
    stroke: {
      width: 0,
    },
    dataLabels: {
      enabled: false,
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
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content relative">
          <span className="block">Revenue</span>
          <h3 className="!-tracking-[0.5px] !mb-[4px] !mt-px !text-3xl">$3M</h3>
          <span className="inline-block text-xs px-[9px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px]">
            +3.4%
          </span>
          <span className="block text-xs mt-[5px]">vs previous 30 days</span>
          <div className="mt-[5px] absolute ltr:-right-[20px] rtl:-left-[20px] top-1/2 -translate-y-1/2 max-w-[135px]">
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

export default Revenue;
