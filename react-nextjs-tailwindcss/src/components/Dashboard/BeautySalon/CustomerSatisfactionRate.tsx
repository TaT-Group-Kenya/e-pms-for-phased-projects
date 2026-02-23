"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CustomerSatisfactionRate: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [80, 20];

  const options: ApexOptions = {
    labels: ["Positive", "Negative"],
    colors: ["#9CAAFF", "#FFAA72"],
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
    legend: {
      show: true,
      fontSize: "12px",
      position: "bottom",
      horizontalAlign: "center",
      itemMargin: {
        horizontal: 8,
        vertical: 2,
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
        <div className="trezo-card-content">
          <span className="block">Customer Satisfaction Rate</span>

          <h2 className="!leading-none !text-2xl md:!text-3xl !mt-[6px] md:!mb-[12px]">
            88.5%
          </h2>

          {isChartLoaded && (
            <Chart
              options={options}
              series={series}
              type="pie"
              height={180}
              width={"100%"}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerSatisfactionRate;
