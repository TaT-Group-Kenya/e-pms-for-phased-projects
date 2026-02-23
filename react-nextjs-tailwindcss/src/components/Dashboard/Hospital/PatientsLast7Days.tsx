"use client";

import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts with Next.js dynamic import
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PatientsLast7Days: React.FC = () => {
  // Chart
  const [isChartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    setChartLoaded(true);
  }, []);

  const series = [
    {
      name: "Patients",
      data: [60, 50, 40, 50, 45, 40, 60],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#FE7A36"],
    plotOptions: {
      bar: {
        borderRadius: 3,
        columnWidth: "9px",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      show: true,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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
      max: 60,
      min: 0,
      labels: {
        show: false,
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
    fill: {
      opacity: 1,
    },
    grid: {
      show: false,
      borderColor: "#ECEEF2",
    },
    legend: {
      show: true,
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
      <div className="trezo-card bg-orange-100 dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md relative">
        <div className="trezo-card-content pb-[81px]">
          <span className="block">Patients Last 7 Days</span>
          
          <h3 className="!mb-0 !flex !items-center !font-medium !text-xl !mt-[11px]">
            768
            <span className="relative font-medium text-xs inline-block text-danger-700 bg-danger-200 dark:bg-[#15203c] border border-danger-300 dark:border-[#15203c] py-[1.5px] ltr:pl-[22px] rtl:pr-[22px] ltr:pr-[10px] rtl:pl-[10px] rounded-full ltr:ml-[10px] rtl:mr-[10px]">
              <i className="ri-arrow-down-fill absolute ltr:left-[6px] rtl:right-[6px] text-base top-1/2 -translate-y-1/2 mt-px"></i>
              3%
            </span>
          </h3>

          <div className="absolute -bottom-[5px] left-0 right-0">
            {isChartLoaded && (
              <Chart
                options={options}
                series={series}
                type="bar"
                height={100}
                width={"100%"}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientsLast7Days;
