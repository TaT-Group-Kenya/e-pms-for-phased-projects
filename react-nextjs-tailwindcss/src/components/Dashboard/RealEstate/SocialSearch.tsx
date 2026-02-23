"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SocialSearch: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [35, 50, 60, 70];

  const options: ApexOptions = {
    plotOptions: {
      radialBar: {
        hollow: {
          size: "40%",
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            fontSize: "14px",
            color: "#64748B",
            fontWeight: "400",
          },
          value: {
            show: true,
            color: "#3A4252",
            fontSize: "22px",
            fontWeight: "600",
            offsetY: 3,
          },
          total: {
            show: false,
            fontSize: "14px",
            color: "#64748B",
            fontWeight: "400",
          },
        },
      },
    },
    labels: ["Facebook", "Instagram", "Linkedin", "YouTube"],
    colors: ["#AD63F6", "#3584FC", "#37D80A", "#FD5812"],
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <h5 className="!mb-[5px]">Social Search</h5>

          <span className="block text-sm">Total traffic in this week</span>

          <div className="-mb-[23px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="radialBar"
                height={240}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialSearch;
