"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OnTimeDelivery: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [85, 15];

  const options: ApexOptions = {
    labels: ["Delivered", "Canceled"],
    colors: ["#37D80A", "#FF4023"],
    legend: {
      show: true,
      position: "left",
      fontSize: "12px",
      horizontalAlign: "center",
      offsetX: -25,
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
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "11px",
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <span className="block">On-Time Delivery</span>
          </div>
        </div>
        <div className="trezo-card-content">
          <div className="max-w-[310px] mx-auto -mt-[5px] -mb-[8px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="pie"
                height={182}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OnTimeDelivery;
