"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MenWomen: React.FC = () => {
  // Chart state
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  // Chart data
  const series = [75, 25];

  // Chart options
  const options: ApexOptions = {
    labels: ["Men", "Woman"],
    stroke: {
      width: 0,
      show: true,
      colors: ["#ffffff"],
    },
    colors: ["#AD63F6", "#3584FC"],
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "80%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      show: true,
      fontSize: "12px",
      position: "right",
      horizontalAlign: "center",
      offsetX: -9,
      offsetY: -2,
      itemMargin: {
        horizontal: 0,
        vertical: 5,
      },
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 5,
        offsetX: -2,
        offsetY: 1.5,
        shape: "circle",
      },
      customLegendItems: ["Men: 75%", "Women: 25%"],
    },
  };

  return (
    <>
      {isChartLoaded && (
        <Chart
          options={options}
          series={series}
          type="donut"
          height={80}
          width={"100%"}
        />
      )}
    </>
  );
};

export default MenWomen;
