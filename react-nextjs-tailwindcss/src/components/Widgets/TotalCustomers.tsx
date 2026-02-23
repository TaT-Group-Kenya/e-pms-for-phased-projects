"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalCustomers: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Orders",
      data: [55, 50, 60, 45, 85, 80, 100],
    },
    {
      name: "Sales",
      data: [45, 38, 80, 65, 55, 75, 90],
    },
  ];

  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#605DFF", "#C2CDFF"],
    stroke: {
      width: 2,
      curve: "straight",
    },
    grid: {
      show: true,
      borderColor: "#ffffff",
    },
    xaxis: {
      categories: [
        "01 Jun",
        "02 Jun",
        "03 Jun",
        "04 Jun",
        "05 Jun",
        "06 Jun",
        "07 Jun",
      ],
      axisTicks: {
        show: false,
        color: "#ECEEF2",
      },
      axisBorder: {
        show: false,
        color: "#ECEEF2",
      },
      labels: {
        show: false,
        style: {
          colors: "#8695AA",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      show: false,
      labels: {
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
    legend: {
      show: false,
      fontSize: "12px",
      position: "bottom",
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
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="block">Total Customers</span>
              <span className="inline-block px-[8.3px] py-[1px] text-success-700 border border-success-300 bg-success-100 dark:bg-[#15203c] dark:border-[#172036] text-sm ltr:ml-[10px] rtl:mr-[10px] rounded-[100px]">
                +5.4
              </span>
            </div>
            <span className="block text-sm">Last 7 days</span>
          </div>

          <h5 className="!text-lg md:!text-[20px] !mb-0 !mt-[5px]">1,528</h5>

          <div className="mx-auto max-w-[300px] -mt-[33px] -mb-[32px]">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="line"
                height={152}
                width={"100%"}
              />
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="block">1 June</span>
            <span className="block">7 June</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalCustomers;
