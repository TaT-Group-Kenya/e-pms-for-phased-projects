"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PropertiesForRent: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [35];

  const options: ApexOptions = {
    colors: ["#605DFF"],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          // margin: 10,
          size: "45%",
          background: "#F5F7F8",
        },
        track: {
          background: "#F5F7F8",
        },
        dataLabels: {
          name: {
            show: false,
            offsetY: -10,
            color: "#4b9bfa",
            fontSize: ".625rem",
          },
          value: {
            offsetY: 5,
            show: true,
            fontWeight: 700,
            color: "#3A4252",
            fontSize: "14px",
          },
        },
      },
    },
    labels: ["Status"],
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content relative">
          <div className="flex items-center justify-between">
            <span className="inline-block px-[8.5px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#15203c] rounded-[100px] text-xs">
              +35%
            </span>
            <span className="block text-xs">Last 30 days</span>
          </div>

          <div className="h-[70px]"></div>

          <span className="block mb-[4px]">Properties for Rent</span>

          <h3 className="!mb-0 !text-[20px]">2,510</h3>

          <div className="absolute ltr:-right-[95px] rtl:-left-[95px] -bottom-[35px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="radialBar"
                height={150}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertiesForRent;
