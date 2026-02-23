"use client";

import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MarketSentimentIndicator: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [100];

  const options: ApexOptions = {
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#ffffff",
          strokeWidth: "100%",
        },
        dataLabels: {
          show: false,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        gradientToColors: ["#FF3D00"],
        stops: [0, 50, 100],
        colorStops: [
          { offset: 0, color: "#00C851", opacity: 1 }, // Extreme Greed (Green)
          { offset: 25, color: "#8BC34A", opacity: 1 }, // Greed (Light Green)
          { offset: 50, color: "#FFC107", opacity: 1 }, // Neutral (Yellow)
          { offset: 75, color: "#FF9800", opacity: 1 }, // Fear (Orange)
          { offset: 100, color: "#FF3D00", opacity: 1 }, // Extreme Fear (Red)
        ],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Market Sentiment"],
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Market Sentiment Indicator</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="-mt-[30px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="radialBar"
                height={365}
                width={"100%"}
              />
            )}
          </div>

          <div className="flex mx-auto justify-center items-center flex-wrap text-xs max-w-[315px] gap-[13px] -mt-[30px]">
            <div className="flex items-center gap-[5px]">
              <span>🟢</span>
              Extreme Greed
            </div>
            <div className="flex items-center gap-[5px]">
              <span>🟢</span>
              Greed
            </div>
            <div className="flex items-center gap-[5px]">
              <span>🟡</span>
              Neutral
            </div>
            <div className="flex items-center gap-[5px]">
              <span>🟠</span>
              Fear
            </div>
            <div className="flex items-center gap-[5px]">
              <span>🔴</span>
              Extreme Fear
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketSentimentIndicator;
